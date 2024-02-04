require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const Joi = require("joi");
const { format, addHours } = require("date-fns");

const swaggerSpec = require("./swaggerDef"); // Import the Swagger configuration
const swaggerUi = require("swagger-ui-express"); // Add this line
const swaggerJsdoc = require("swagger-jsdoc");

const accessToken = process.env.JWT_SECRET;
const baseApiDomain = process.env.API_BASE_URL;

app.use(express.json()); // For parsing application/json

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:5077",
  "http://localhost:4321",
  "http://localhost:5078",
  "http://localhost:5077",
  "https://bread.loaf.cat/",
  "https://mrrr.loaf.cat",
  "null", // Specifically allow 'null' origin
];

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  next();
});

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5077",
    "http://localhost:4321",
    "http://localhost:5078",
    "http://localhost:5077",
    "https://bread.loaf.cat/",
    "https://mrrr.loaf.cat",
  ],
  optionsSuccessStatus: 200,
  // allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//#######       ROUTES AND FUNCTIONs             #########//

/**
 * Fetches the leaderboard data from the Directus MRR Backend.
 * It makes an authenticated GET request to the Directus API, using the provided access token.
 * The function assumes that the 'leaders_board' collection exists in Directus.
 *
 * @returns {Promise<Object>} The leaderboard data as a JSON object.
 * @throws Will throw an error if the GET request fails.
 */
const getLeadersBoard = async (limit) => {
  try {
    const response = await axios.get(`${baseApiDomain}items/leaders_board`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        fields: ["*"],
        limit: limit, // Limit the results to the top 10 players
        sort: "-level", // This will sort the results by the 'level' field in descending order
      },
    });
    // Return the data part of the response which contains the leaderboard
    return response.data;
  } catch (error) {
    console.error("Error fetching leaders board:", error);
    throw error;
  }
};

// Express route handler for the '/api/leadersboard' endpoint.
// This route provides a JSON response containing the leaders board data.
// app.get("/api/leadersboard", async (req, res) => {
//   try {
//     const limit = req.body.limit || 10;

//     const leadersBoard = await getLeadersBoard(limit);
//     res.json(leadersBoard);
//   } catch (error) {
//     // If an error occurs, respond with a 500 status code and an error message
//     res.status(500).json({ message: "Failed to fetch leaders board" });
//   }
// });

app.post("/", async (req, res) => {
  res.json({ hello: "world" });
});
/**
 * Creates a new user in the Directus MRR Backend.
 * It makes an authenticated POST request to the Directus API to create a user record.
 * The function assumes that the 'users_data' collection exists in Directus and is set up
 * to receive all necessary user information.
 *
 * @param {Object} userData - The data for the new user.
 * @returns {Promise<Object>} The response from the Directus API after user creation.
 * @throws Will throw an error if the POST request fails.
 */
const createUser = async (userData) => {
  try {
    console.log("userData", userData);
    const response = await axios.post(
      `${baseApiDomain}items/users_data`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // Return the response from Directus which should contain the created user data
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Searches for a user by wallet address in the Directus 'users_data' collection.
 *
 * @param {string} walletAddress - The wallet address to search for.
 * @returns {Promise<boolean>} True if the user exists, false otherwise.
 */
const findUserByWallet = async (walletAddress) => {
  try {
    // Construct the URL for querying the 'users_data' collection
    const url = `${baseApiDomain}items/users_data`;

    // Set the params to filter the 'users_data' collection by the 'UserID' field
    const params = {
      filter: {
        UserID: {
          _eq: walletAddress,
        },
      },
      limit: 1, // We only need to know if at least one record exists
    };

    // Make the GET request to Directus to search for the user
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    });

    // Check the response data to determine if a user was found
    return response.data.data && response.data.data.length > 0;
  } catch (error) {
    console.error("Error searching for user by wallet address:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};
const validateUsername = async (username) => {
  try {
    // Construct the URL for querying the 'users_data' collection
    const url = `${baseApiDomain}items/users_data`;

    // Set the params to filter the 'users_data' collection by the 'UserID' field
    const params = {
      filter: {
        UserName: {
          _eq: username,
        },
      },
      limit: 1, // We only need to know if at least one record exists
    };

    // Make the GET request to Directus to search for the user
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    });
    console.log(response);
    // Check the response data to determine if a user was found
    return response.data.data && response.data.data.length > 0;
  } catch (error) {
    console.error("Error searching for user by wallet address:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

/**
 * Inserts default player data into the players_table in Directus.
 *
 * @param {string} userID - The unique identifier for the user, which is their Solana wallet address.
 * @returns {Promise<Object>} - The response from the Directus API after inserting the player data.
 */
const insertDefaultPlayerData = async (userID) => {
  try {
    const playerData = {
      UserID: userID,
      CurrentLevel: 1, // Starting level
      CurrentExperience: 0, // Starting experience points
      // Add other player default fields as needed
    };

    const response = await axios.post(
      `${baseApiDomain}items/players_table`,
      playerData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error inserting default player data:", error);
    throw error;
  }
};

/**
 * Inserts default items for the user into the users_items table in Directus.
 *
 * @param {string} userID - The unique identifier for the user, which is their Solana wallet address.
 * @returns {Promise<Object>} - The response from the Directus API after inserting the item data.
 */
const insertDefaultUserItems = async (userID) => {
  try {
    // Define the default items to give to a new player. Replace with actual item IDs.
    const itemsData = {
      UserID: userID,
      Index: 1,
      ItemID: 118, // The ID of the default item
      Quantity: 1, // The quantity of the default item
    };

    const response = await axios.post(
      `${baseApiDomain}items/users_items`,
      itemsData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error inserting default user items:", error);
    throw error;
  }
};

// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user record in the Directus backend.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *               username:
 *                 type: string  # Include "username" field
 *               RegistrationDate:
 *                 type: integer
 *               LastActiveDate:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User and player data created successfully.
 *       400:
 *         description: Validation error.
 *       409:
 *         description: User already exists.
 *       500:
 *         description: An error occurred while creating the user.
 */
// Define a schema for user data validation
const userSchema = Joi.object({
  UserID: Joi.string().alphanum().length(44).required(), // Example validation for Solana wallet, which is typically 44 base58 characters
  username: Joi.string().required(), // Include "username" field
  RegistrationDate: Joi.number().integer().required(),
  LastActiveDate: Joi.number().integer().required(),
});
// Express route handler for creating a new user in the '/api/users' endpoint.
// This route expects a JSON body with user data and creates a new user record in the Directus backend.
app.post("/api/users", async (req, res) => {
  try {
    // Extract the wallet address from the request
    const walletAddress = req.body.UserID;
    const username = req.body.username;

    // Validate the request data against the schema
    const { value, error } = userSchema.validate(req.body);

    // If validation fails, return a 400 Bad Request response
    if (error) {
      // Construct a simple error message from the first error in the details array
      const simpleMessage = error.details
        .map((detail) => detail.message.replace(/\"/g, ""))
        .join(", ");
      return res
        .status(400)
        .json({ message: "Validation error: " + simpleMessage });
    }

    // Check if the wallet address already exists in the database
    const existingUser = await findUserByWallet(walletAddress);
    const availableUsername = await validateUsername(username);
    if (existingUser || availableUsername) {
      // If the user exists, return a conflict response
      return res.status(409).json({ message: "User already exists." });
    }

    // If validation succeeds, proceed to create the user with sanitized data
    const newUserData = {
      UserID: value.UserID,
      UserName: value.username,
      RegistrationDate: value.RegistrationDate, // Ensure date is in ISO format
      LastActiveDate: value.LastActiveDate, // Ensure date is in ISO format
    };

    // Create the user using the createUser function (defined elsewhere)
    const userCreationResponse = await createUser(newUserData);
    if (userCreationResponse) {
      // Insert default player data into the players_table
      await insertDefaultPlayerData(walletAddress);

      // Insert default items into the users_items table
      await insertDefaultUserItems(walletAddress);

      // Return a success message after all insertions are complete
      res
        .status(201)
        .json({ message: "User and player data created successfully." });
    }
  } catch (error) {
    // Check if the environment is development for detailed error messages
    if (process.env.NODE_ENV === "development") {
      // Provide full error details in development mode
      res.status(500).json({
        message: "An error occurred while creating the user.",
        error: error.message,
        stack: error.stack, // Include the stack trace for more detailed debugging
      });
    } else {
      // Provide a generic error message in production mode
      res
        .status(500)
        .json({
          message:
            "An error occurred while creating the user. Please try again later.",
        });
    }
  }
});

/**
 * @swagger
 * /api/process-deposits:
 *   post:
 *     summary: Process deposits for a user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The user's ID.
 *             required:
 *               - UserID
 *     responses:
 *       '200':
 *         description: Deposits processed successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
app.post("/api/process-deposits", async (req, res) => {
  try {
    const userWallet = req.body.UserID;

    // Retrieve all deposit records for the user with PointsFilled == false
    const deposits = await getDeposits(userWallet);
    console.log("Deposits:", deposits); // Log the deposits array

    // Check if there are deposits to process
    if (deposits.length === 0) {
      return res
        .status(200)
        .json({
          message:
            "You don't have any pending deposits. Please deposit LOAF or SOLANA.",
        });
    }
    const logPromises = []; // Prepare an array to hold all log promises

    // Process each deposit and calculate points
    for (const deposit of deposits) {
      console.log("Individual deposit:", deposit);
      await updateUserCredits(userWallet, deposit); // Pass the entire deposit object
      await markDepositAsFilled(deposit.id);
      // Log the deposit processing activity
      const logPromise = logActivity(userWallet, {
        type: "deposit",
        itemId: null,
        amountSpent: null,
        previousCredits: null,
        newCredits: null,
        additionalDetails: JSON.stringify(deposit),
      });

      logPromises.push(logPromise); // Add the log activity promise to the array
    }
    await Promise.all(logPromises); // Wait for all log activities to complete

    res.status(200).json({ message: "Deposits processed successfully." });
  } catch (error) {
    console.error("Error processing deposits:", error);

    // Check if the environment is development for detailed error messages
    if (process.env.NODE_ENV === "development") {
      // Provide full error details in development mode
      res.status(500).json({
        message: "An error occurred while processing deposits.",
        error: error.message,
        stack: error.stack, // Include the stack trace for more detailed debugging
      });
    } else {
      // Provide a generic error message in production mode
      res
        .status(500)
        .json({
          message: "Failed to process deposits. Please try again later.",
        });
    }
  }
});

// Function to get deposits for a user where PointsFilled is false
// Function to get deposits for a user where PointsFilled is false

async function getDeposits(userWallet) {
  try {
    const response = await axios.get(`${baseApiDomain}items/deposits`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        filter: {
          sender_wallet: {
            _eq: userWallet,
          },
          points_filled: {
            _neq: true,
          },
        },
      },
    });
    console.log("Raw deposits response:", response.data); // Log the raw response
    return response.data.data;
  } catch (error) {
    console.error("Error retrieving deposits:", error);
    throw error;
  }
}

// Function to update user's points in players_table
async function updateUserCredits(userWallet, deposit) {
  try {
    console.log(
      `Updating points for wallet: ${userWallet} with deposit amount: ${deposit}`
    );

    // Convert deposit amount to points based on currency
    let points = 0;
    let currency = deposit.currency[0]; // Access the first element of the currency array
    if (currency === "SOL") {
      points = parseFloat(deposit.amount) / 1; // SOL conversion rate
    } else if (currency === "LOAF") {
      points = parseFloat(deposit.amount) / 1000; // LOAF conversion rate
    }

    console.log(`Calculated points to add: ${points}`);

    const playersResponse = await axios.get(
      `${baseApiDomain}items/players_table`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          filter: {
            UserID: {
              _eq: userWallet,
            },
          },
        },
      }
    );

    if (playersResponse.data.data.length === 0) {
      throw new Error(`No player data found for wallet ${userWallet}`);
    }

    // Get current player data
    const playerData = playersResponse.data.data[0];
    // Calculate new points
    const newPoints = playerData.UserCredits + points;
    // Update player data in Directus
    const updateResponse = await axios.patch(
      `${baseApiDomain}items/players_table/${playerData.id}`,
      {
        UserCredits: newPoints,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return updateResponse.data;
  } catch (error) {
    console.error("Error updating user's points:", error);
    throw error;
  }
}

// Function to mark deposit as filled
async function markDepositAsFilled(depositId) {
  try {
    const response = await axios.patch(
      `${baseApiDomain}items/deposits/${depositId}`,
      {
        points_filled: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error marking deposit as filled:", error);
    throw error;
  }
}

/**
 * @swagger
 * /api/user-items/:
 *   post:
 *     summary: Get user items with details.
 *     description: Retrieve user items with related details for a specific user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user for whom to retrieve items.
 *                 example: user123
 *     responses:
 *       200:
 *         description: Successfully retrieved user items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   itemId:
 *                     type: string
 *                     description: The unique ID of the user item.
 *                   quantity:
 *                     type: integer
 *                     description: The quantity of the user item.
 *                   details:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the item.
 *                       description:
 *                         type: string
 *                         description: The description of the item.
 *                       pointValue:
 *                         type: string
 *                         description: The point value of the item.
 *                       price:
 *                         type: string
 *                         description: The price of the item.
 *                       category:
 *                         type: string
 *                         description: The category of the item.
 *                 example:
 *                   - itemId: item1
 *                     quantity: 3
 *                     details:
 *                       name: Item A
 *                       description: Description A
 *                       pointValue: 10
 *                       price: $5
 *                       category: Category 1
 *                   - itemId: item2
 *                     quantity: 1
 *                     details:
 *                       name: Item B
 *                       description: Description B
 *                       pointValue: 5
 *                       price: $2
 *                       category: Category 2
 *       404:
 *         description: User not found or user has no items.
 *       500:
 *         description: An error occurred while fetching user items.
 */

// Endpoint to get user items with details
app.post("/api/user-items/", async (req, res) => {
  try {
    const { UserID } = req.body;

    // Fetch user items from Directus, including related game items
    const userItemsResponse = await axios.get(
      `${baseApiDomain}items/users_items`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          filter: {
            UserID: {
              _eq: UserID,
            },
          },
          // Adjust to the correct relational field name and nested fields
          fields: ["*", "ItemID.*"],
        },
      }
    );

    // Extract the items data
    const userItemsData = userItemsResponse.data.data;
    console.log("userItemsData", userItemsData);

    // Format the user items into a more readable JSON structure
    const formattedUserItems = userItemsData.map((item) => {
      // Ensure related item data exists
      const relatedItem = item.ItemID || {};
      return {
        itemId: item.id,
        index: item.Index,
        quantity: item.Quantity,
        details: {
          name: relatedItem.item_name || "N/A", // Use fallback if undefined
          description: relatedItem.Description || "N/A",
          pointValue: relatedItem.PointValue || "N/A",
          price: relatedItem.Price || "N/A",
          category: relatedItem.Category || "N/A",
        },
      };
    });

    console.log("formattedUserItems", formattedUserItems);
    // Respond with formatted JSON
    res.json(formattedUserItems);
  } catch (error) {
    console.error("Error fetching user items:", error);
    res.status(500).json({ message: "Failed to fetch user items" });
  }
});

// app.post("/api/buy-item", async (req, res) => {
//   try {
//       const userId = req.body.UserID;
//       const itemId = req.body.ItemID;

//       // Get item information from game_items
//       const itemResponse = await axios.get(`${baseApiDomain}items/game_items/${itemId}`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       const itemData = itemResponse.data.data;

//       // Get user credits information from players_table
//       const playerResponse = await axios.get(`${baseApiDomain}items/players_table`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//           params: { filter: { UserID: { _eq: userId } } },
//       });
//       const playerData = playerResponse.data.data[0];

//       if (playerData.UserCredits < itemData.Price) {
//           return res.status(400).json({ message: "Not enough credits to purchase item" });
//       }

//       // Deduct item price from user credits and update players_table
//       const newCredits = playerData.UserCredits - itemData.Price;
//       await axios.patch(`${baseApiDomain}items/players_table/${playerData.id}`, {
//           UserCredits: newCredits,
//       }, { headers: { Authorization: `Bearer ${accessToken}` } });

//       // Check if user already owns the item
//       const userItemsResponse = await axios.get(`${baseApiDomain}items/users_items`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//           params: {
//               filter: {
//                   UserID: { _eq: userId },
//                   ItemID: { _eq: itemId }
//               }
//           },
//       });
//       const userItems = userItemsResponse.data.data;

//       if (userItems.length > 0) {
//           // User already owns the item, update quantity
//           const existingItem = userItems[0];
//           const newQuantity = existingItem.Quantity + 1;
//           await axios.patch(`${baseApiDomain}items/users_items/${existingItem.id}`, {
//               Quantity: newQuantity,
//           }, { headers: { Authorization: `Bearer ${accessToken}` } });
//       } else {
//           // User does not own the item, create new record
//           await axios.post(`${baseApiDomain}items/users_items`, {
//               UserID: userId,
//               ItemID: itemId,
//               Quantity: 1
//           }, { headers: { Authorization: `Bearer ${accessToken}` } });
//       }

//       // Respond with success message
//       res.status(200).json({ message: "Item purchased successfully" });
//   } catch (error) {
//       console.error("Error purchasing item:", error);
//       res.status(500).json({ message: "Failed to purchase item" });
//   }
// });

/**
 * @swagger
 * /api/buy-item:
 *   post:
 *     summary: Purchase an item.
 *     description: Purchase an item for a specific user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user making the purchase.
 *                 example: user123
 *               ItemID:
 *                 type: integer
 *                 description: The ID of the item to be purchased.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully purchased item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: Item purchased successfully.
 *       400:
 *         description: Not enough credits to purchase item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Not enough credits to purchase item.
 *       500:
 *         description: An error occurred while processing the purchase.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to purchase item.
 */
app.post("/api/buy-item", async (req, res) => {
  try {
    const userId = req.body.UserID;
    const itemId = req.body.ItemID;

    // Parallel fetch for item and player data
    const [itemResponse, playerResponse] = await Promise.all([
      axios.get(`${baseApiDomain}items/game_items/${itemId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      axios.get(`${baseApiDomain}items/players_table`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { filter: { UserID: { _eq: userId } } },
      }),
    ]);

    const itemData = itemResponse.data.data;
    const playerData = playerResponse.data.data[0];

    if (playerData.UserCredits < itemData.Price) {
      return res
        .status(400)
        .json({ message: "Not enough credits to purchase item" });
    }

    // Update logic
    const newCredits = playerData.UserCredits - itemData.Price;
    const newTotalSpent = playerData.TotalSpent + itemData.Price; // Calculate new total spent

    // Prepare the promise to update or add the user item
    const updatePlayerPromise = axios.patch(
      `${baseApiDomain}items/players_table/${playerData.id}`,
      {
        UserCredits: newCredits,
        TotalSpent: newTotalSpent, // Update total spent along with credits
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const updateUserItemPromise = updateUserItem(userId, itemId);

    // Fetch user_items_daily entry
    const dailyItemResponse = await axios.get(
      `${baseApiDomain}items/user_items_daily`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          filter: { UserID: { _eq: userId }, ItemID: { _eq: itemId } },
        },
      }
    );
    const dailyItemData = dailyItemResponse.data.data[0];
    if (!dailyItemData) {
      return res.status(404).json({ message: "Item not found in daily items" });
    }
    const markItemAsPurchasedPromise = axios.patch(
      `${baseApiDomain}items/user_items_daily/${dailyItemData.id}`,
      {
        IsPurchased: true,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Log the purchase activity
    const logActivityPromise = logActivity(userId, {
      type: "purchase",
      itemId: itemData.id,
      amountSpent: itemData.Price,
      previousCredits: playerData.UserCredits,
      newCredits: playerData.UserCredits - itemData.Price,
      additionalDetails: JSON.stringify({ itemName: itemData.item_name }),
    });
    // Execute updates in parallel
    await Promise.all([
      updatePlayerPromise,
      updateUserItemPromise,
      markItemAsPurchasedPromise,
      logActivityPromise,
    ]);

    // Respond with success message
    res.status(200).json({ message: "Item purchased successfully" });
  } catch (error) {
    console.error("Error purchasing item:", error);
    res.status(500).json({ message: "Failed to purchase item" });
  }
});

async function updateUserItem(userId, itemId) {
  // Check if user already owns the item
  const userItemsResponse = await axios.get(
    `${baseApiDomain}items/users_items`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        filter: {
          UserID: { _eq: userId },
          ItemID: { _eq: itemId },
        },
      },
    }
  );

  const userItems = userItemsResponse.data.data;
  if (userItems.length > 0) {
    // User already owns the item, update quantity
    const existingItem = userItems[0];
    const newQuantity = existingItem.Quantity + 1;
    return axios.patch(
      `${baseApiDomain}items/users_items/${existingItem.id}`,
      {
        Quantity: newQuantity,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } else {
    // User does not own the item, create new record
    return axios.post(
      `${baseApiDomain}items/users_items`,
      {
        UserID: userId,
        ItemID: itemId,
        Quantity: 1,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  }
}

/**
 * @swagger
 * /api/daily-purchases:
 *   post:
 *     summary: Get total daily purchases for a user.
 *     description: Retrieve the total amount spent by a user on a specific date.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: integer
 *                 description: The timestamp representing the date and time.
 *                 example: 1672521600
 *               UserID:
 *                 type: string
 *                 description: The ID of the user for whom the daily purchases are requested.
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Successfully retrieved total daily purchases.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDailyPurchases:
 *                   type: number
 *                   description: The total amount spent by the user on the specified date.
 *                   example: 50.25
 *       500:
 *         description: An error occurred while fetching daily purchases.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch daily purchases.
 */

app.post("/api/daily-purchases", async (req, res) => {
  try {
    // Assume the front end sends the date in the format of yyyy-mm-dd
    const { date, UserID } = req.body;
    console.log(date, UserID);
    const startTimestamp = new Date(date).setUTCHours(0, 0, 0, 0);
    const endTimestamp = new Date(date).setUTCHours(23, 59, 59, 999);

    // const startTimestamp = Math.floor(startOfDay / 1000);
    // const endTimestamp = Math.floor(endOfDay / 1000);
    console.log(startTimestamp, endTimestamp);

    const response = await axios.get(`${baseApiDomain}items/activity_log`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        filter: {
          UserID: { _eq: UserID },
          ActivityType: { _eq: "purchase" },
          ActivityDate: { _gte: startTimestamp, _lte: endTimestamp },
          AmountSpent: { _nnull: true },
        },
      },
    });

    console.log("Response data:", response.data.data);

    // Filter out entries with null AmountSpent
    const validPurchases = response.data.data.filter(
      (activity) => activity.AmountSpent != null
    );

    const totalSpent = validPurchases.reduce((acc, activity) => {
      return acc + parseFloat(activity.AmountSpent);
    }, 0);

    console.log("Total Spent:", totalSpent);

    // Respond with the summed total
    res.status(200).json({ totalDailyPurchases: totalSpent });
  } catch (error) {
    console.error("Error fetching daily purchases:", error);
    res.status(500).json({ message: "Failed to fetch daily purchases" });
  }
});

/**
 * @swagger
 * /api/total-purchases:
 *   post:
 *     summary: Get the total amount spent by a user on purchases.
 *     description: Retrieve the total amount spent by a user on purchase activities.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user for whom the total purchases are requested.
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Successfully retrieved total purchases.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPurchases:
 *                   type: number
 *                   description: The total amount spent by the user on purchases.
 *                   example: 100.5
 *       500:
 *         description: An error occurred while fetching total purchases.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch total purchases.
 */
app.post("/api/total-purchases", async (req, res) => {
  try {
    const { UserID } = req.body; // Use query parameters for GET requests

    const response = await axios.get(`${baseApiDomain}items/activity_log`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        filter: {
          UserID: { _eq: UserID },
          ActivityType: { _eq: "purchase" },
          AmountSpent: { _nnull: true }, // This filters out records with null AmountSpent
        },
      },
    });

    // Sum the amounts spent
    const totalSpent = response.data.data.reduce((acc, activity) => {
      return acc + parseFloat(activity.AmountSpent || 0); // Add fallback to 0 to handle null values
    }, 0);

    // Respond with the summed total
    res.status(200).json({ totalPurchases: totalSpent });
  } catch (error) {
    console.error("Error fetching total purchases:", error);
    res.status(500).json({ message: "Failed to fetch total purchases" });
  }
});

// Function to calculate additional time for next feeding event
function calculateAdditionalTime(
  currentHungerLevel,
  feedingAmount,
  originalIntervalHours
) {
  const MAX_HUNGER_LEVEL = 100;
  let newHungerLevel = Math.min(
    currentHungerLevel + feedingAmount,
    MAX_HUNGER_LEVEL
  );
  let percentageSatisfied =
    (newHungerLevel - currentHungerLevel) / MAX_HUNGER_LEVEL;
  let additionalTime =
    percentageSatisfied * originalIntervalHours * 3600 * 1000;
  return additionalTime;
}

async function getFeedingEventIdForPet(petId) {
  try {
    const response = await axios.get(`${baseApiDomain}items/scheduled_events`, {
      params: {
        filter: {
          PetID: { _eq: petId },
          EventType: { _eq: "Feeding" },
        },
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.data.length > 0 ? response.data.data[0].id : null;
  } catch (error) {
    console.error("Error fetching Feeding event ID:", error);
    throw error;
  }
}

// Function to calculate feeding amount based on food type and quantity
function calculateFeedingAmount(foodType, quantity) {
  const foodValues = {
    fruit: 5, // Each fruit increases hunger by 5%
    vegetable: 4, // Each vegetable increases hunger by 4%
    junkFood: 3, // Each junk food increases hunger by 3%
    junkLiquid: 2, // Each junk liquid increases hunger by 2%
    drink: 1,
    // Add other food types as needed
  };

  let feedingValue = foodValues[foodType] || 0;
  return quantity * feedingValue; // Total increase in hunger level
}

// Function to update the event timestamp
async function updateFeedingEventTimestamp(eventId, newEventTime) {
  try {
    // Use Math.floor to avoid decimals in timestamp
    newEventTime = Math.floor(newEventTime);
    console.log("newEventTime------", newEventTime, eventId);
    await axios.patch(
      `${baseApiDomain}items/scheduled_events/${eventId}`,
      {
        EventTime: newEventTime, // assuming 'eventtimestamp' is the correct field name
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (error) {
    console.error("Error updating Feeding event timestamp:", error);
    throw error;
  }
}

// Function to get the current Feeding event timestamp
async function getCurrentFeedingEventTime(petId) {
  try {
    console.log("petId----", petId);
    const response = await axios.get(`${baseApiDomain}items/scheduled_events`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        filter: {
          PetID: { _eq: petId },
          EventType: { _eq: "Feeding" },
        },
      },
    });
    console.log("response", response.data.data[0].EventTime);
    if (response.data.data.length > 0) {
      // Assuming 'event_time' is the field name for the timestamp in your database
      return response.data.data[0].EventTime;
    } else {
      throw new Error("Feeding event not found for the pet");
    }
  } catch (error) {
    console.error("Error fetching current Feeding event time:", error);
    throw error;
  }
}

/**
 * @swagger
 * /api/feed-pet:
 *   post:
 *     summary: Feed a pet and update its status.
 *     description: Feed a pet, update its hunger and fluffiness levels, and log the feeding activity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user performing the feeding action.
 *                 example: "user123"
 *               ItemID:
 *                 type: integer
 *                 description: The ID of the item used to feed the pet.
 *                 example: "1"
 *               PetID:
 *                 type: integer
 *                 description: The ID of the pet to be fed.
 *                 example: 323
 *               foodType:
 *                 type: string
 *                 description: The type of food used for feeding.
 *                 example: "fruit"
 *               quantity:
 *                 type: integer
 *                 description: The quantity of food items to be fed.
 *                 example: 3
 *     responses:
 *       200:
 *         description: Successfully fed the pet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the pet has been fed successfully.
 *                   example: "Pet has been fed successfully."
 *       400:
 *         description: Insufficient item quantity to feed the pet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that there is an insufficient quantity of the item to feed the pet.
 *                   example: "Insufficient item quantity."
 *       404:
 *         description: Item not found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the specified item was not found for the user.
 *                   example: "Item not found for user."
 *       500:
 *         description: An error occurred while feeding the pet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the feeding process failed.
 *                   example: "Failed to feed pet."
 */
app.post("/api/feed-pet", async (req, res) => {
  try {
    const { UserID, ItemID, PetID, foodType, quantity } = req.body; // Include PetID in the request body

    // Get the current item data for the user
    const userItemResponse = await axios.get(
      `${baseApiDomain}items/users_items`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          filter: {
            UserID: { _eq: UserID },
            ItemID: { _eq: ItemID },
          },
          fields: ["*", "ItemID.*"], // Make sure to fetch related game item fields
        },
      }
    );
    console.log("ItemID Object:", userItemResponse.data.data[0].ItemID);

    // Check if the user has the item and the quantity is sufficient
    if (userItemResponse.data.data.length > 0) {
      const userItem = userItemResponse.data.data[0];
      const category = userItemResponse.data.data[0].ItemID.Category; // Assuming this is how you access the category

      if (userItem.Quantity > 0) {
        // Reduce the quantity by 1
        const newQuantity = userItem.Quantity - 1;

        // Update the item quantity in the database
        await axios.patch(
          `${baseApiDomain}items/users_items/${userItem.id}`,
          {
            Quantity: newQuantity,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // Determine points based on the category of the item
        let feedingExperiencePoints = 0;
        switch (category) {
          case "food":
            feedingExperiencePoints = 1;
            break;
          case "liquid":
            feedingExperiencePoints = 2;
            break;
          case "toy":
            feedingExperiencePoints = 5;
            break;
          case "experience":
            feedingExperiencePoints = 10;
            break;
          // Add more cases as needed
          default:
            feedingExperiencePoints = 0;
        }
        console.log(
          "feedingExperiencePoints",
          feedingExperiencePoints,
          category
        );
        // Update the user experience
        if (feedingExperiencePoints > 0) {
          await updateUserExperience(UserID, feedingExperiencePoints, "feed");
        }
        // Fetch the correct pet ID from the database
        const petIdResponse = await axios.get(`${baseApiDomain}items/pet`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { PetID: PetID },
          fields: ["id"],
        });
        const actualPetId = petIdResponse.data.data[0].id;

        // Fetch the correct pet ID from the database
        // Fetch pet's current state and feeding event details concurrently
        const [petResponse, feedingEventId] = await Promise.all([
          axios.get(`${baseApiDomain}items/pet/${PetID}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          //getFeedingEventIdForPet(PetID)
        ]);

        let currentHungerLevel = petResponse.data.data.HungerLevel || 0;
        let currentHydrationLevel = petResponse.data.data.HydrationLevel || 0;
        let currentFluffinessLevel = petResponse.data.data.FluffinessLevel || 0;
        let increaseAmount = calculateFeedingAmount(foodType, quantity);
        // Calculate the increased hunger level
        let newHungerLevel = currentHungerLevel + increaseAmount;
        let newHydrationLevel = currentHydrationLevel + 1;

        let fluffinessIncrease = 0; // You will define how much to increase FluffinessLevel by

        // If the new hunger level is greater than 99, set it to 100, otherwise round it
        if (newHungerLevel > 99) {
          // If the HungerLevel is over 100, cap it at 100 and increase the FluffinessLevel
          fluffinessIncrease = newHungerLevel - 100; // Calculate excess hunger as fluffiness increase
          newHungerLevel = 100;
        } else {
          newHungerLevel = Math.round(newHungerLevel);
        }

        // Calculate the new FluffinessLevel if there is an increase
        let newFluffinessLevel = 0;
        if (fluffinessIncrease > 0) {
          newFluffinessLevel = Math.round(
            currentFluffinessLevel + fluffinessIncrease
          );
        }

        // Fetch the current event time from the database for the feeding event
        let currentEventTime = await getCurrentFeedingEventTime(PetID); // Fetch this from the database based on `feedingEventId`
        let originalIntervalHours = 6; // Original interval for Feeding

        // Initialize update data object
        let updateData = {
          FluffinessLevel: newFluffinessLevel,
          LastUpdateTime: new Date().getTime(),
        };
        // Calculate additional time only if newHungerLevel did not reach 100
        let additionalTime = 0;
        if (newHungerLevel < 100) {
          let originalIntervalHours = 6; // Original interval for Feeding (6 hours)
          additionalTime = calculateAdditionalTime(
            currentHungerLevel,
            increaseAmount,
            originalIntervalHours
          );
        }

        // Determine which level to update based on the food type
        if (foodType === "drink") {
          updateData.HydrationLevel = newHydrationLevel; // Assuming newHydrationLevel is calculated somewhere
        } else {
          updateData.HungerLevel = newHungerLevel < 100 ? newHungerLevel : 100; // Cap HungerLevel at 100
        }

        console.log("updateData", updateData);
        let newEventTime = currentEventTime + additionalTime;
        console.log("newEventTime in ROUTE----", newEventTime);
        // Fetch the Feeding event ID for the pet
        const eventId = await getFeedingEventIdForPet(actualPetId);

        if (!eventId) {
          throw new Error("Feeding event not found for the pet");
        }

        // Perform both updates concurrently
        await Promise.all([
          axios.patch(`${baseApiDomain}items/pet/${actualPetId}`, updateData, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);
        // Only update the event timestamp if additional time is calculated
        if (additionalTime > 0) {
          await updateFeedingEventTimestamp(eventId, newEventTime);
        }

        // Log the user login aka connect wallet activity using Promise.all for parallel requests
        await Promise.all([
          logActivity(UserID, {
            type: foodType,
            additionalDetails: `Feed Activity in category:  ${category}.`,
          }),
          // Add other parallel logging activities here if needed
        ]);

        res.status(200).json({ message: "Pet has been fed successfully." });
      } else {
        res.status(400).json({ message: "Insufficient item quantity." });
      }
    } else {
      res.status(404).json({ message: "Item not found for user." });
    }
  } catch (error) {
    console.error("Error feeding pet:", error);
    res.status(500).json({ message: "Failed to feed pet." });
  }
});

async function updateUserExperience(userId, pointsEarned, activityType) {
  const playerResponse = await axios.get(
    `${baseApiDomain}items/players_table`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { filter: { UserID: { _eq: userId } } },
    }
  );
  const playerData = playerResponse.data.data[0];

  // Retrieve level data to calculate experience thresholds and bonuses
  const levelsResponse = await axios.get(`${baseApiDomain}items/levels`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const levels = levelsResponse.data.data;

  // Calculate new experience points based on the activity
  const activityPoints = calculateActivityPoints(
    playerData,
    pointsEarned,
    activityType,
    levels
  );
  let newExperience = playerData.CurrentExperience + activityPoints;

  // Check for level up
  const nextLevel = levels.find(
    (level) => level.LevelNumber === playerData.CurrentLevel + 1
  );
  if (nextLevel && newExperience >= nextLevel.ExperienceThreshold) {
    // Update the player's level
    await axios.patch(
      `${baseApiDomain}items/players_table/${playerData.id}`,
      {
        CurrentLevel: playerData.CurrentLevel + 1,
        // Reset experience points or keep accumulating, depending on your game design
        CurrentExperience: newExperience - nextLevel.ExperienceThreshold,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  } else {
    // Just update the experience points
    await axios.patch(
      `${baseApiDomain}items/players_table/${playerData.id}`,
      {
        CurrentExperience: newExperience,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  }
}

function calculateActivityPoints(
  playerData,
  pointsEarned,
  activityType,
  levels
) {
  console.log(`Calculating points for activityType: ${activityType}`);

  const currentLevelData = levels.find(
    (level) => level.LevelNumber === playerData.CurrentLevel
  );
  // Calculate points based on activity type
  switch (activityType) {
    case "login":
      return currentLevelData.LoginPoints;
    case "purchase":
      // Calculate based on money spent, for example
      return pointsEarned * currentLevelData.PurchasePointsMultiplier;
    case "feed":
      // Calculate points for feeding the pet, e.g., 5 points per feed
      return 5;

    // Add cases for other activity types...
    default:
      return 0;
  }
}

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in a user and update login-related data.
 *     description: Log in a user with his phantom wallet, update the last login timestamp in "players_table" and the last active date in "users_data," and log the login activity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user logging in.
 *                 example: "CudDUqHiLDAnj4q6smfDbHC61Z5uCxhGjosN2NU2sa4b"
 *     responses:
 *       200:
 *         description: User login was successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the user login was successful.
 *                   example: "Login successful"
 *                 user:
 *                   type: object
 *                   description: User data, such as user ID.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the logged-in user.
 *                       example: "user123"
 *       404:
 *         description: User not found in either "players_table" or "users_data."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the user was not found.
 *                   example: "User not found"
 *       500:
 *         description: An error occurred during the login process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the login process failed.
 *                   example: "Login failed"
 */
/**
 * Handles user login and updates the last activity timestamps in the 'players_table' and 'users_data' collections.
 *
 * This route expects a JSON body with the user's login credentials, specifically the 'UserID' (phantom wallet address).
 * It fetches the user's ID from 'players_table' and 'users_data' based on the provided 'UserID'.
 * If the user is found in both collections, it updates the 'LastLoginDate' in 'players_table' and 'LastActiveDate' in 'users_data'
 * to the current timestamp, indicating the user's last login and activity.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Object} A JSON response indicating a successful login or an error if the user is not found or if an error occurs.
 * @throws Will throw an error if there's a problem updating the timestamps or if the POST request fails.
 */

app.post("/api/login", async (req, res) => {
  try {
    // Extract the user's login credentials from the request
    const { UserID } = req.body;

    // Fetch the user's ID from "players_table"
    const playerResponse = await axios.get(
      `${baseApiDomain}items/players_table`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { filter: { UserID: { _eq: UserID } } },
      }
    );
    const playerData = playerResponse.data.data[0];

    // Fetch the user's ID from "users_data"
    const userDataResponse = await axios.get(
      `${baseApiDomain}items/users_data`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { filter: { UserID: { _eq: UserID } } },
      }
    );
    const userData = userDataResponse.data.data[0];

    if (!playerData || !userData) {
      // Handle the case where the user is not found in either table
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date().getTime(); // Get the current timestamp in milliseconds

    // Update the last login timestamp in "players_table"
    await axios.patch(
      `${baseApiDomain}items/players_table/${playerData.id}`,
      {
        LastLoginDate: now,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Update the last active date in "users_data"
    await axios.patch(
      `${baseApiDomain}items/users_data/${userData.id}`,
      {
        LastActiveDate: now,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Log the user login aka connect wallet activity using Promise.all for parallel requests
    await Promise.all([
      logActivity(UserID, {
        type: "userLogin",
        additionalDetails: `User Login.`,
      }),
      // Add other parallel logging activities here if needed
    ]);
    // Respond with a success message or user data if needed
    res.status(200).json({ message: "Login successful", user: { id: UserID } });
  } catch (error) {
    // Check if the environment is development for detailed error messages
    if (process.env.NODE_ENV === "development") {
      // Provide full error details in development mode
      res.status(500).json({
        message:
          "An error occurred while updating the login timestamp for user.",
        error: error.message,
        stack: error.stack, // Include the stack trace for more detailed debugging
      });
    } else {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  }
});

/**
 * @swagger
 * /api/start-game:
 *   post:
 *     summary: Start a new game session for a user.
 *     description: Start a new game session for a user by updating the "StartTime" field in "game_plays" or creating a new record if the user doesn't exist in the table. It also logs the game-start activity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user starting the game session.
 *                 example: "user123"
 *     responses:
 *       201:
 *         description: Game session started successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the game session was started successfully.
 *                   example: "Game started successfully"
 *                 UserID:
 *                   type: string
 *                   description: The ID of the user whose game session was started.
 *                   example: "user123"
 *       500:
 *         description: An error occurred while starting the game session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the game session failed to start.
 *                   example: "Failed to start the game"
 */

/**
 * Express route handler for starting a game for a user in the '/api/start-game' endpoint.
 * This route expects a JSON body with user and game data and initiates a new game session.
 */
app.post("/api/start-game", async (req, res) => {
  try {
    // Extract the user's ID (UserID) from the request
    const { UserID } = req.body;

    // Fetch the user's data from "game_plays"
    const playerResponse = await axios.get(`${baseApiDomain}items/game_plays`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { filter: { UserID: { _eq: UserID } } },
    });

    const playerData =
      playerResponse.data.data.length > 0 ? playerResponse.data.data[0] : null;

    // Check if the user already exists in the "players_table"
    if (playerData) {
      // If the user exists, update the "StartTime" field
      const now = new Date().getTime(); // Get the current timestamp in milliseconds
      await axios.patch(
        `${baseApiDomain}items/game_plays/${playerData.id}`,
        {
          StartTime: now,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } else {
      // If the user is not found, create a new record with the current timestamp as "StartTime"
      const newGameSession = {
        UserID: UserID, // Use the UserID from the request
        StartTime: new Date().getTime(),
      };
      await createPlayer(newGameSession);
    }
    // Log the game-start activity using Promise.all for parallel requests
    await Promise.all([
      logActivity(UserID, {
        type: "gameStart",
        additionalDetails: `Game session start.`,
      }),
      // Add other parallel logging activities here if needed
    ]);
    // Respond with a success message
    res
      .status(201)
      .json({ message: "Game started successfully", UserID: UserID });
  } catch (error) {
    console.error("Error starting game:", error);
    res.status(500).json({ message: "Failed to start the game" });
  }
});

/**
 * Creates a new player record in the "game_plays."
 *
 * @param {Object} newGameSession - The game session data with UserID and StartTime.
 * @returns {Promise<void>} A promise that resolves when the player record is created.
 * @throws Will throw an error if there's a problem creating the player record.
 */
async function createPlayer(newGameSession) {
  try {
    // Create a new player record in "game_plays"
    await axios.post(`${baseApiDomain}items/game_plays`, newGameSession, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    // Handle errors or throw them further if needed
    throw error;
  }
}

/**
 * @swagger
 * /api/end-game:
 *   post:
 *     summary: End the user's game session.
 *     description: End the user's game session by updating the "EndTime" and "Duration" fields in the "game_plays" table. It also logs the game-ending activity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user ending the game session.
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Game session ended successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the game session was ended successfully.
 *                   example: "Game ended successfully"
 *                 UserID:
 *                   type: string
 *                   description: The ID of the user whose game session was ended.
 *                   example: "user123"
 *       404:
 *         description: User not found in game_plays.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the user was not found in the game_plays table.
 *                   example: "User not found in game_plays"
 *       500:
 *         description: An error occurred while ending the game session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the game session failed to end.
 *                   example: "Failed to end the game"
 */
/**
 * Express route handler for ending a game for a user in the '/api/end-game' endpoint.
 * This route expects a JSON body with user data and updates the game session with an end time and duration.
 */
app.post("/api/end-game", async (req, res) => {
  try {
    // Extract the user's ID (UserID) from the request
    const { UserID } = req.body;

    // Fetch the user's data from "game_plays"
    const playerResponse = await axios.get(`${baseApiDomain}items/game_plays`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { filter: { UserID: { _eq: UserID } } },
    });

    const playerData =
      playerResponse.data.data.length > 0 ? playerResponse.data.data[0] : null;

    // Check if the user exists in the "players_table"
    if (playerData) {
      // Calculate the end time and duration
      const now = new Date().getTime(); // Get the current timestamp in milliseconds
      const duration = now - playerData.StartTime; // Calculate the duration

      // Update the "EndTime" and "Duration" fields
      await axios.patch(
        `${baseApiDomain}items/game_plays/${playerData.id}`,
        {
          EndTime: now,
          Duration: duration,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Log the game-ending activity using Promise.all for parallel requests
      await Promise.all([
        logActivity(UserID, {
          type: "gameEnd",
          additionalDetails: `Game session ended with duration: ${duration} ms`,
        }),
        // Add other parallel logging activities here if needed
      ]);
      // Respond with a success message
      res
        .status(200)
        .json({ message: "Game ended successfully", UserID: UserID });
    } else {
      // Handle the case where the user is not found in "game_plays"
      res.status(404).json({ message: "User not found in game_plays" });
    }
  } catch (error) {
    console.error("Error ending game:", error);
    res.status(500).json({ message: "Failed to end the game" });
  }
});

/**
 * @swagger
 * /api/daily-spent:
 *   post:
 *     summary: Update the daily spent amount for a user.
 *     description: |
 *       Update the daily spent amount for a user by summing up the 'AmountSpent' from purchase activities recorded on the current day. It then updates the 'DailySpent' field in the 'players_table' for the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user for whom the daily spent amount should be updated.
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Daily spent updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDailySpent:
 *                   type: number
 *                   description: The total amount spent by the user on the current day.
 *                   example: 25.5
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the daily spent amount was updated successfully.
 *                   example: "Daily spent updated successfully."
 *       500:
 *         description: An error occurred while updating the daily spent amount.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the daily spent amount failed to update.
 *                   example: "Failed to update daily spent"
 */
// Daily spent  can be button and cron job
//e'll assume that the date sent from the frontend will be the current date in the user's local time,
//which we will convert to UTC for comparison with the stored UTC timestamps in the database.
app.post("/api/daily-spent", async (req, res) => {
  try {
    const { UserID } = req.body; // Assuming UserID is sent as a query parameter
    const today = new Date(); // Use the current date
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0)).getTime(); // Start of the day in UTC
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999)).getTime(); // End of the day in UTC
    // Fetch the player's record to get the ID for patching
    const playerResponse = await axios.get(
      `${baseApiDomain}items/players_table`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { filter: { UserID: { _eq: UserID } } },
      }
    );
    const player = playerResponse.data.data[0];
    // Fetch all purchase activities for the current day
    const response = await axios.get(`${baseApiDomain}items/activity_log`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        filter: {
          UserID: { _eq: UserID },
          ActivityType: { _eq: "purchase" },
          ActivityDate: { _gte: startOfDay, _lte: endOfDay },
        },
      },
    });

    // Sum up the 'AmountSpent' from the activities
    const dailySpent = response.data.data.reduce((acc, record) => {
      return acc + (record.AmountSpent ? parseFloat(record.AmountSpent) : 0);
    }, 0);

    // Update the 'DailySpent' field in the players_table for the user
    if (player && player.id) {
      await axios.patch(
        `${baseApiDomain}items/players_table/${player.id}`,
        {
          DailySpent: dailySpent,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      res.json({
        totalDailySpent: dailySpent,
        message: "Daily spent updated successfully.",
      });
    } else {
      throw new Error("Player not found");
    }
  } catch (error) {
    console.error("Error updating daily spent:", error);
    res.status(500).json({ message: "Failed to update daily spent" });
  }
});

/**
 * @swagger
 * /api/update-playtime:
 *   post:
 *     summary: Update the total playtime for a user.
 *     description: |
 *       Update the total playtime for a user by calculating the difference between gameStart and gameEnd activities recorded in the 'activity_log'. It then updates the 'TotalPlaytime' field in the 'players_table' for the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user for whom the total playtime should be updated.
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Total playtime updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPlaytime:
 *                   type: number
 *                   description: The total playtime (in milliseconds) calculated and updated for the user.
 *                   example: 3600000
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the total playtime was updated successfully.
 *                   example: "Total playtime updated successfully."
 *       500:
 *         description: An error occurred while updating the total playtime.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the total playtime failed to update.
 *                   example: "Failed to update total playtime"
 */
// may need cron job to update total spent
app.post("/api/update-playtime", async (req, res) => {
  try {
    const { UserID } = req.body; // Assuming UserID is sent as a query parameter
    // Fetch the player's record to get the ID for patching
    const playerResponse = await axios.get(
      `${baseApiDomain}items/players_table`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { filter: { UserID: { _eq: UserID } } },
      }
    );
    const player = playerResponse.data.data[0];

    // Fetch all gameStart and gameEnd activities for the user
    const response = await axios.get(`${baseApiDomain}items/activity_log`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        filter: {
          UserID: { _eq: UserID },
          ActivityType: { _in: ["gameStart", "gameEnd"] },
        },
        sort: ["ActivityDate"],
      },
    });

    // Calculate the total playtime
    let totalPlaytime = 0;
    let lastStartTime = null;
    response.data.data.forEach((activity) => {
      if (activity.ActivityType === "gameStart") {
        lastStartTime = activity.ActivityDate;
      } else if (activity.ActivityType === "gameEnd" && lastStartTime) {
        totalPlaytime += activity.ActivityDate - lastStartTime; // Calculate the difference
        lastStartTime = null; // Reset the start time for the next cycle
      }
    });

    // Update the 'TotalPlaytime' field in the players_table for the user
    if (player && player.id) {
      await axios.patch(
        `${baseApiDomain}items/players_table/${player.id}`,
        {
          TotalPlaytime: totalPlaytime,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      res.json({
        totalPlaytime: totalPlaytime,
        message: "Total playtime updated successfully.",
      });
    } else {
      throw new Error("Player not found");
    }
  } catch (error) {
    console.error("Error updating total playtime:", error);
    res.status(500).json({ message: "Failed to update total playtime" });
  }
});

/**
 * @swagger
 * /api/update-total-care-activities:
 *   post:
 *     summary: Update the total care activities for a user.
 *     description: |
 *       Update the total care activities for a user by calculating the number of care-related activities (mental, feed, bodycare) recorded in the 'activity_log'. It then updates the 'TotalCareActivities' field in the 'players_table' for the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user for whom the total care activities should be updated.
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Total care activities updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCareActivities:
 *                   type: number
 *                   description: The total number of care activities calculated and updated for the user.
 *                   example: 25
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the total care activities were updated successfully.
 *                   example: "Total care activities updated successfully."
 *       500:
 *         description: An error occurred while updating the total care activities.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the total care activities failed to update.
 *                   example: "Failed to update total care activities"
 */
app.post("/api/update-total-care-activities", async (req, res) => {
  try {
    const { UserID } = req.body;

    // Fetch the player's record to get the ID for patching
    const playerResponse = await axios.get(
      `${baseApiDomain}items/players_table`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { filter: { UserID: { _eq: UserID } } },
      }
    );
    const player = playerResponse.data.data[0];

    // Fetch all care-related activities for the user
    const activitiesResponse = await axios.get(
      `${baseApiDomain}items/activity_log`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          filter: {
            UserID: { _eq: UserID },
            ActivityType: { _in: ["mental", "feed", "bodycare"] },
          },
        },
      }
    );

    // Calculate the total care activities
    const totalCareActivities = activitiesResponse.data.data.length;

    // Update the 'TotalCareActivities' field in the players_table for the user
    if (player && player.id) {
      await axios.patch(
        `${baseApiDomain}items/players_table/${player.id}`,
        {
          TotalCareActivities: totalCareActivities,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      res.json({
        totalCareActivities: totalCareActivities,
        message: "Total care activities updated successfully.",
      });
    } else {
      throw new Error("Player not found");
    }
  } catch (error) {
    console.error("Error updating total care activities:", error);
    res.status(500).json({ message: "Failed to update total care activities" });
  }
});

/**
 * @swagger
 * /api/update-total-care-special-activities:
 *   post:
 *     summary: Update the total special care activities for a user.
 *     description: |
 *       Update the total special care activities for a user by calculating the number of 'special' care-related activities recorded in the 'activity_log'. It then updates the 'TotalSpecialActivities' field in the 'players_table' for the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user for whom the total special care activities should be updated.
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Total special care activities updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCareSpecialActivities:
 *                   type: number
 *                   description: The total number of special care activities calculated and updated for the user.
 *                   example: 10
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the total special care activities were updated successfully.
 *                   example: "Total special care activities updated successfully."
 *       500:
 *         description: An error occurred while updating the total special care activities.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the total special care activities failed to update.
 *                   example: "Failed to update total special care activities"
 */
app.post("/api/update-total-care-special-activities", async (req, res) => {
  try {
    const { UserID } = req.body;

    // Fetch the player's record to get the ID for patching
    const playerResponse = await axios.get(
      `${baseApiDomain}items/players_table`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { filter: { UserID: { _eq: UserID } } },
      }
    );
    const player = playerResponse.data.data[0];

    // Fetch all care-related activities for the user
    const activitiesResponse = await axios.get(
      `${baseApiDomain}items/activity_log`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          filter: {
            UserID: { _eq: UserID },
            ActivityType: { _in: ["special"] },
          },
        },
      }
    );

    // Calculate the total care activities
    const totalCareSpecialActivities = activitiesResponse.data.data.length;

    // Update the 'totalCareSpecialActivities' field in the players_table for the user
    if (player && player.id) {
      await axios.patch(
        `${baseApiDomain}items/players_table/${player.id}`,
        {
          TotalSpecialActivities: totalCareSpecialActivities,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      res.json({
        totalCareSpecialActivities: totalCareSpecialActivities,
        message: "Total Special care activities updated successfully.",
      });
    } else {
      throw new Error("Player not found");
    }
  } catch (error) {
    console.error("Error updating total care activities:", error);
    res.status(500).json({ message: "Failed to update total care activities" });
  }
});

// This function calculates the next event time based on the event type and returns a timestamp
function calculateNextEventTime(eventType) {
  const now = new Date();
  let hoursToAdd;
  switch (eventType) {
    case "Feeding":
      hoursToAdd = 6;
      break;
    case "Drink":
      hoursToAdd = 6;
      break;
    case "Cleaning":
      hoursToAdd = 24;
      break;
    case "Exercise":
      hoursToAdd = 12;
      break;
    case "HealthCheck":
      hoursToAdd = 48;
      break;
    case "Happiness":
      hoursToAdd = 24; // Assuming happiness events are daily, adjust as needed
      break;
    case "MentalHealth":
      hoursToAdd = 24; // Assuming happiness events are daily, adjust as needed
      break;
    case "Experience":
      hoursToAdd = 24; // Assuming happiness events are daily, adjust as needed
      break;
    //... add cases for other event types if necessary
    default:
      hoursToAdd = 24;
  }
  return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000).getTime(); // Convert to timestamp
}

/**
 * @swagger
 * /api/link-pet:
 *   post:
 *     summary: Link a pet to a user and create default events
 *     description: Links a pet to a user and creates default scheduled events for the pet.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The ID of the user linking the pet.
 *               petType:
 *                 type: string
 *                 description: The type of the pet (e.g., cat, dog).
 *               PetID:
 *                 type: string
 *                 description: The ID of the pet (NFT ID).
 *     responses:
 *       201:
 *         description: Pet linked and default events created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request, pet is already linked and alive or pet exists but is not alive.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to link pet and create default events.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// Express route handler to link a pet to a user and create default events
app.post("/api/link-pet", async (req, res) => {
  try {
    const { UserID, petType, PetID } = req.body;
    const petIDString = String(PetID); // Convert PetID to string

    // Step 0: Check if the pet is already linked and is alive
    const existingPetsResponse = await axios.get(`${baseApiDomain}items/pet`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { filter: { UserID: { _eq: UserID }, PetID: { _eq: PetID } } },
    });
    const existingPets = existingPetsResponse.data.data;
    const existingPet = existingPets.find((pet) => pet.PetID === petIDString);

    // Check if any pet matches the PetID and determine their alive status
    if (existingPet) {
      // Pet with the same PetID is already linked
      if (existingPet.is_a_live) {
        // The pet is alive
        return res
          .status(400)
          .json({ message: "Pet is already linked and alive." });
      } else {
        // The pet exists but is not alive
        return res
          .status(400)
          .json({ message: "Pet exists but is not alive." });
      }
    }
    const petName = await generateCatName();
    // Step 1: Create a new pet in the 'pet' collection with default values
    const newPetData = {
      PetID: PetID, //PetID is the NFT ID that we will fetch from phantom wallet
      UserID: UserID,
      Name: petName,
      Type: petType,
      HungerLevel: 100,
      CleanlinessLevel: 100,
      HappinessLevel: 100,
      HealthLevel: 100,
      MentalHealthLevel: 100,
      ExperienceLevel: 100,
      ExerciseLevel: 100,
      PeeLevel: 30,
      PoopLevel: 30,
      LastCleanTime: new Date(),
      LastFedTime: new Date(),
      LastPlayTime: new Date(),
      LastHealthCheck: new Date(),
      LastUpdateTime: new Date(),
    };

    const createPetResponse = await axios.post(
      `${baseApiDomain}items/pet`,
      newPetData,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Step 2: Get the ID of the newly created pet
    const petID = createPetResponse.data.data.id;

    // Step 3: Create default scheduled events for the new pet
    const defaultEvents = [
      { eventType: "Feeding", eventTime: calculateNextEventTime("Feeding") },
      { eventType: "Cleaning", eventTime: calculateNextEventTime("Cleaning") },
      { eventType: "Exercise", eventTime: calculateNextEventTime("Exercise") },
      {
        eventType: "HealthCheck",
        eventTime: calculateNextEventTime("HealthCheck"),
      },
      {
        eventType: "Happiness",
        eventTime: calculateNextEventTime("Happiness"),
      },
      {
        eventType: "MentalHealth",
        eventTime: calculateNextEventTime("MentalHealth"),
      },
      {
        eventType: "Experience",
        eventTime: calculateNextEventTime("Experience"),
      },
      { eventType: "Drink", eventTime: calculateNextEventTime("Drink") },

      ///.... add every other event that have timer related to the pet
    ];

    // Create each event in the 'scheduled_events' collection
    for (let event of defaultEvents) {
      await axios.post(
        `${baseApiDomain}items/scheduled_events`,
        {
          PetID: petID,
          EventType: event.eventType,
          EventTime: event.eventTime,
          IsCompleted: false,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }

    res
      .status(201)
      .json({ message: "Pet linked and default events created successfully." });
  } catch (error) {
    console.error("Error linking pet:", error);
    res
      .status(500)
      .json({ message: "Failed to link pet and create default events." });
  }
});

/**
 * @swagger
 * /api/clean-wc:
 *   post:
 *     summary: Clean WC levels for a pet
 *     description: Clean WC levels (PeeLevel or PoopLevel) for a specific pet based on the action type (Peeing or Pooping).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actionType:
 *                 type: string
 *                 description: The action type, which can be 'Peeing' or 'Pooping'.
 *               PetID:
 *                 type: string
 *                 description: The ID of the pet to clean WC levels for.
 *               UserID:
 *                 type: string
 *                 description: The ID of the user who owns the pet.
 *     responses:
 *       200:
 *         description: Pets WC levels cleaned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Pet not found for the provided PetID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to clean pets WC levels.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/api/clean-wc", async (req, res) => {
  try {
    const { actionType, PetID, UserID } = req.body; // 'Peeing' or 'Pooping'

    const DECREMENT_AMOUNT = 30;
    const petResponse = await axios.get(`${baseApiDomain}items/pet`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { filter: { UserID: { _eq: UserID }, PetID: { _eq: PetID } } },
    });

    const pet = petResponse.data.data[0];
    if (!pet) {
      return res
        .status(404)
        .json({ message: `Pet not found for PetID: ${PetID}.` });
    }

    let updatedLevels = { LastUpdateTime: new Date().getTime() };
    if (actionType === "Peeing") {
      updatedLevels.PeeLevel = Math.max(pet.PeeLevel - DECREMENT_AMOUNT, 0);
    } else if (actionType === "Pooping") {
      updatedLevels.PoopLevel = Math.max(pet.PoopLevel - DECREMENT_AMOUNT, 0);
    }

    await axios.patch(`${baseApiDomain}items/pet/${pet.id}`, updatedLevels, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    await logActivity(pet.UserID, {
      type: actionType,
      additionalDetails: `Cleaned WC for pet ${PetID}. ${actionType} level decreased.`,
    });

    res
      .status(200)
      .json({
        message: `Pets WC levels cleaned for ${actionType} successfully for PetID: ${PetID}.`,
      });
  } catch (error) {
    console.error(
      `Error cleaning pets WC levels for ${actionType} for PetID: ${PetID}:`,
      error.response?.data || error
    );
    res
      .status(500)
      .json({
        message: `Failed to clean pets WC levels for ${actionType} for PetID: ${PetID}.`,
      });
  }
});

// We reset the Levels of PEE and POO if they are above 80 and log the event for Self Peeing and Self Pooping
async function resetWcLevels(pet, UserID) {
  let updatedFields = {};
  console.log(pet);

  // Check and reset PeeLevel
  if (pet.PeeLevel >= 80) {
    updatedFields.PeeLevel = 0;
    updatedFields.CleanlinessLevel = 0; // Reset CleanlinessLevel to 0 cause its dirty

    // Log the pee event
    await logActivity(UserID, {
      type: "Self_Peeing",
      additionalDetails: `PetID: ${pet.PetID} has peed.`,
    });
  }

  // Check and reset PoopLevel
  if (pet.PoopLevel >= 80) {
    updatedFields.PoopLevel = 0;
    updatedFields.CleanlinessLevel = 0; // Reset CleanlinessLevel to 0

    // Log the poop event
    await logActivity(UserID, {
      type: "Self_Pooping",
      additionalDetails: `PetID: ${pet.PetID} has pooped.`,
    });
  }

  return updatedFields;
}

/**
 * @swagger
 * /api/update-wc:
 *   post:
 *     summary: Update WC levels for pets
 *     description: Update WC levels (PeeLevel and PoopLevel) for all pets based on time elapsed since the last update.
 *     responses:
 *       200:
 *         description: Pets WC levels updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to update pets WC levels.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/api/update-wc", async (req, res) => {
  try {
    // Constants for incrementing levels
    const PEE_INCREMENT_PER_HOUR = 10; // Increase by 10 per hour
    const POOP_INCREMENT_PER_HOUR = 8; // Increase by 8 per hour

    // Fetch all pets
    const petsResponse = await axios.get(`${baseApiDomain}items/pet`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const pets = petsResponse.data.data;

    // Process each pet
    pets.forEach(async (pet) => {
      const now = new Date().getTime();
      const timeSinceLastUpdate =
        (now - new Date(pet.LastUpdateTime).getTime()) / (1000 * 3600); // Hours since last update

      // Calculate new PeeLevel and PoopLevel
      let newPeeLevel = Math.min(
        pet.PeeLevel + PEE_INCREMENT_PER_HOUR * timeSinceLastUpdate,
        100
      );
      let newPoopLevel = Math.min(
        pet.PoopLevel + POOP_INCREMENT_PER_HOUR * timeSinceLastUpdate,
        100
      );

      // Prepare updated levels object
      let updatedLevels = {
        PeeLevel: newPeeLevel,
        PoopLevel: newPoopLevel,
        LastUpdateTime: now,
      };

      // Reset WC levels and log activities if needed
      const wcReset = await resetWcLevels(pet, pet.UserID); // Ensure UserID is available for the pet
      updatedLevels = { ...updatedLevels, ...wcReset };

      // Update pet in the database
      await axios.patch(`${baseApiDomain}items/pet/${pet.id}`, updatedLevels, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    });

    res.status(200).json({ message: "Pets WC levels updated successfully." });
  } catch (error) {
    console.error("Error updating pets WC levels:", error);
    res.status(500).json({ message: "Failed to update pets WC levels." });
  }
});

/**
 * @swagger
 * /api/get-game-items:
 *   post:
 *     summary: Retrieve game items
 *     description: Retrieve game items based on category and tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               tags:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved game items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Failed to fetch game items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// {
//   "category": "mental",  // All, food , liquid,toy, experiance, mental,
//   "tags": "" // "", junk_food, mental etc..
// }
app.post("/api/get-game-items", async (req, res) => {
  try {
    const { category, tags, limit } = req.body;

    // Initialize parameters
    let params = new URLSearchParams({
      "fields[0]": "id",
      "fields[1]": "item_name",
      "fields[2]": "PointValue",
      "fields[3]": "Description",
      "fields[4]": "Price",
      "fields[5]": "Category",
      "fields[6]": "Tags",
      "fields[7]": "LevelAccess",
      limit: limit,
    });

    // Append category and tags filters if needed
    if (category !== "All") {
      params.append("filter[Category][_eq]", category);
    }
    if (tags !== "") {
      params.append("filter[Tags][_contains]", tags);
    }

    const response = await axios.get(`${baseApiDomain}items/game_items`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: params,
    });

    const gameItems = response.data.data;
    res.status(200).json({ category, items: gameItems });
  } catch (error) {
    console.error("Error fetching game items:", error);
    res.status(500).json({ message: "Failed to fetch game items." });
  }
});

// Leadersboard
/**
 * @swagger
 * /api/leadersboard:
 *   post:
 *     summary: Retrieve leaderboard data
 *     description: Retrieve leaderboard data based on UserID and limit.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *               limit:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved leaderboard data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leadersBoard:
 *                   type: array
 *                   items:
 *                     type: object
 *       409:
 *         description: Issue with the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to fetch leaderboard data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/api/leadersboard", async (req, res) => {
  try {
    const { UserID, limit } = req.body;
    if (!UserID) {
      return res
        .status(409)
        .json({ message: "There is issue. Try Again Later." });
    }
    let params = new URLSearchParams({
      "fields[0]": "id",
      "fields[1]": "UserID",
      "fields[2]": "Rank",
      "fields[3]": "Experience",
      "fields[4]": "Level",
      sort: "-level",
      limit: limit,
    });

    const response = await axios.get(`${baseApiDomain}items/leaders_board`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params,
    });

    const leadersBoard = response.data.data;
    res.status(200).json({ leadersBoard: leadersBoard });
  } catch (error) {
    console.error("Error fetching game items:", error);
    res.status(500).json({ message: "Failed to fetch leaders board." });
  }
});

// MY Pet
/**
 * @swagger
 * /api/my-pet:
 *   post:
 *     summary: Retrieve pet data
 *     description: Retrieve pet data based on UserID and PetID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *               PetID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved pet data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pet:
 *                   type: object
 *       404:
 *         description: Pet not found or pet is dead
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to fetch pet data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/api/my-pet", async (req, res) => {
  try {
    const { UserID, PetID } = req.body;
    if (!UserID && !PetID) {
      return res
        .status(409)
        .json({ message: "There is an issue. Try Again Later." });
    }
    const params = {
      filter: {
        id: {
          _eq: PetID,
        },
      },
      fields: [
        "id",
        "PetID",
        "UserID",
        "HungerLevel",
        "CleanlinessLevel",
        "HappinessLevel",
        "HealthLevel",
        "LastFedTime",
        "LastCleanTime",
        "LastPlayTime",
        "LastHealthCheck",
        "is_a_live",
        "lives",
        "MentalHealthLevel",
        "ExperienceLevel",
        "Type",
        "Name",
        "LastUpdateTime",
        "ExerciseLevel",
        "FluffinessLevel",
        "PoopLevel",
        "PeeLevel",
        "HydrationLevel",
        "Level.id",
        "Level.experience_threshold",
        "Level.login_points",
        "Level.playtime_pointsRate",
        "Level.care_activity_points",
        "Level.special_activity_bonus",
        "Level.purchase_points_cap",
        "Level.LevelNumber",
      ],
      // fields: ['*', 'Level.*'],
    };

    const response = await axios.get(`${baseApiDomain}items/pet`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params,
    });

    const petData = response.data.data;

    if (petData.length === 0) {
      return res
        .status(404)
        .json({ message: "No pet found for the provided UserID and PetID." });
    }

    const pet = petData[0]; // Access the first item in the array

    if (!pet.is_a_live) {
      return res
        .status(404)
        .json({
          message:
            "Pet was found but it's dead. You can revive your pet by visiting our '9 Lives' Page where you can bring it back to life!",
        });
    }

    res.status(200).json({ pet });
  } catch (error) {
    console.error("Error fetching pet data:", error);
    res.status(500).json({ message: "Failed to fetch pet data." });
  }
});

/**
 * @swagger
 * /api/my-pets:
 *   post:
 *     summary: Fetch live pets for a user
 *     description: Retrieve live pet data for a specific user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The user's unique identifier.
 *     responses:
 *       200:
 *         description: A list of live pets for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier of the pet.
 *                   PetID:
 *                     type: string
 *                     description: The unique identifier of the pet.
 *       404:
 *         description: No live pets found for the provided UserID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating no live pets were found.
 *       409:
 *         description: There is an issue with the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating an issue with the request.
 *       500:
 *         description: An error occurred while fetching pet data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating a server error.
 */
app.post("/api/my-pets", async (req, res) => {
  try {
    const { UserID } = req.body;
    if (!UserID) {
      return res
        .status(409)
        .json({ message: "There is an issue. Try Again Later." });
    }
    const params = {
      filter: {
        UserID: {
          _eq: UserID,
        },
      },
      fields: [
        "id",
        "PetID",
        "UserID",
        "HungerLevel",
        "CleanlinessLevel",
        "HappinessLevel",
        "HealthLevel",
        "LastFedTime",
        "LastCleanTime",
        "LastPlayTime",
        "LastHealthCheck",
        "is_a_live",
        "lives",
        "MentalHealthLevel",
        "ExperienceLevel",
        "Type",
        "Name",
        "LastUpdateTime",
        "ExerciseLevel",
        "FluffinessLevel",
        "PoopLevel",
        "PeeLevel",
        "HydrationLevel",
        "Level.id",
        "Level.experience_threshold",
        "Level.login_points",
        "Level.playtime_pointsRate",
        "Level.care_activity_points",
        "Level.special_activity_bonus",
        "Level.purchase_points_cap",
        "Level.LevelNumber",
      ],
      // fields: ['*', 'Level.*'],
    };

    const response = await axios.get(`${baseApiDomain}items/pet`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params,
    });

    const petData = response.data.data;

    if (petData.length === 0) {
      return res
        .status(404)
        .json({ message: "No pet found for the provided UserID and PetID." });
    }

    const pets = petData.filter((pet) => pet.is_a_live); // Filter out only live pets

    if (pets.length === 0) {
      return res
        .status(404)
        .json({ message: "No live pets found for the provided UserID." });
    }

    res.status(200).json({ pets });
  } catch (error) {
    console.error("Error fetching pet data:", error);
    res.status(500).json({ message: "Failed to fetch pet data." });
  }
});
// script that loop the scheduled events and update the pet status

// Express route handler to update the pet status based on the scheduled events

/**
 * @swagger
 * /api/user-activity:
 *   post:
 *     summary: Fetch user activity
 *     description: Retrieve user activity data from the Directus database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The user's unique identifier.
 *               startDate:
 *                 type: integer
 *                 format: int64
 *                 description: The start date for the activity query.
 *               endDate:
 *                 type: integer
 *                 format: int64
 *                 description: The end date for the activity query.
 *           examples:
 *             example1:
 *               value:
 *                 UserID: "CudDUqHiLDAnj4q6smfDbHC61Z5uCxhGjosN2NU2sa4b"
 *                 startDate: 1706802603000
 *                 endDate: 1706975403000
 *     responses:
 *       '200':
 *         description: Successful response containing user activity data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userActivity:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique identifier of the user activity entry.
 *                       UserID:
 *                         type: string
 *                         description: The user's unique identifier.
 *                       ActivityType:
 *                         type: string
 *                         description: The type of activity.
 *                       ItemID:
 *                         type: integer
 *                         description: The item's unique identifier (can be null).
 *                       AmountSpent:
 *                         type: number
 *                         description: The amount spent (can be null).
 *                       PreviousCredits:
 *                         type: number
 *                         description: The previous credit balance (can be null).
 *                       NewCredits:
 *                         type: number
 *                         description: The new credit balance (can be null).
 *                       ActivityDate:
 *                         type: integer
 *                         description: The timestamp of the activity date.
 *                       AdditionalDetails:
 *                         type: string
 *                         description: Additional details about the activity.
 *       '400':
 *         description: Bad request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the issue.
 *       '404':
 *         description: User activity data not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that no data was found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating a server error.
 */

app.post("/api/user-activity", async (req, res) => {
  try {
    // Check if the request body contains any required parameters
    if (!req.body) {
      return res.status(400).json({ message: "Request body is empty." });
    }

    // Extract any necessary parameters from req.body
    const { UserID, startDate, endDate } = req.body;

    // Validate userId, startDate, and endDate inputs (customize as needed)
    if (!UserID || typeof UserID !== "string") {
      return res.status(400).json({ message: "Invalid userId." });
    }
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Both startDate and endDate are required." });
    }

    // Initialize parameters for the Directus API request
    let params = {
      // Add any required query parameters here
      "filter[UserID][_eq]": UserID,
      "filter[ActivityDate][_gte]": startDate,
      "filter[ActivityDate][_lte]": endDate,
      "fields[0]": "id",
      "fields[1]": "UserID",
      "fields[2]": "ActivityType",
      "fields[3]": "ItemID",
      "fields[4]": "AmountSpent",
      "fields[5]": "PreviousCredits",
      "fields[6]": "NewCredits",
      "fields[7]": "ActivityDate",
      "fields[8]": "AdditionalDetails",
      // Add any other fields you need here
      sort: "-id", // Sort by ID in descending order
    };

    // Make an HTTP GET request to fetch user activity
    const response = await axios.get(`${baseApiDomain}items/activity_log`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: params,
    });

    const userActivityData = response.data.data;

    // Check if user activity data is empty or not
    if (!userActivityData || userActivityData.length === 0) {
      return res.status(404).json({ message: "User activity data not found." });
    }

    res.status(200).json({ userActivity: userActivityData });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({ message: "Failed to fetch user activity." });
  }
});

/**
 * @swagger
 * /api/events-times:
 *   post:
 *     summary: Fetch scheduled events for a pet
 *     description: Retrieve the list of scheduled events for a given pet from the Directus database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PetID:
 *                 type: string
 *                 description: The unique identifier of the pet for which to fetch scheduled events.
 *           examples:
 *             example1:
 *               value:
 *                 PetID: "pet_unique_id_here"
 *     responses:
 *       '200':
 *         description: Successfully retrieved scheduled events data for the pet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 petEventsData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the scheduled event.
 *                       PetID:
 *                         type: string
 *                         description: The unique identifier of the pet.
 *                       EventType:
 *                         type: string
 *                         description: The type of event scheduled.
 *                       EventTime:
 *                         type: string
 *                         format: date-time
 *                         description: The scheduled time for the event.
 *                       Details:
 *                         type: string
 *                         description: Additional details about the scheduled event.
 *       '400':
 *         description: Bad request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the issue.
 *       '404':
 *         description: No scheduled events data found for the provided PetID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that no data was found.
 *       '500':
 *         description: Internal server error when fetching scheduled events.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating a server error.
 */

app.post("/api/events-times", async (req, res) => {
  try {
    // Check if the request body contains any required parameters
    if (!req.body) {
      return res.status(400).json({ message: "Request body is empty." });
    }

    // Extract any necessary parameters from req.body
    const { PetID } = req.body;

    // Validate userId, startDate, and endDate inputs (customize as needed)
    if (!PetID || typeof PetID !== "string") {
      return res.status(400).json({ message: "Invalid userId." });
    }

    // Initialize parameters for the Directus API request
    let params = {
      // Add any required query parameters here
      "filter[PetID][_eq]": PetID,
      "fields[0]": "id",
      "fields[1]": "PetID",
      "fields[2]": "EventType",
      "fields[3]": "EventTime",
      "fields[4]": "Details",
      // Add any other fields you need here
      sort: "-id", // Sort by ID in descending order
    };

    // Make an HTTP GET request to fetch user activity
    const response = await axios.get(`${baseApiDomain}items/scheduled_events`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: params,
    });

    const petEventsData = response.data.data;

    // Check if user activity data is empty or not
    if (!petEventsData || petEventsData.length === 0) {
      return res
        .status(404)
        .json({ message: "Scheduled Events data for this pet was not found." });
    }

    res.status(200).json({ petEventsData: petEventsData });
  } catch (error) {
    console.error("Error fetching Scheduled Events:", error);
    res.status(500).json({ message: "Failed to fetch Scheduled Events." });
  }
});

/**
 * @swagger
 * /api/daily-items:
 *   get:
 *     summary: Fetch daily items for a user
 *     description: Retrieve daily item data for a specific user.
 *     parameters:
 *       - in: query
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's unique identifier.
 *     responses:
 *       200:
 *         description: A list of daily items for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   itemID:
 *                     type: string
 *                     description: The unique identifier of the daily item.
 *                   itemName:
 *                     type: string
 *                     description: The name of the daily item.
 *       500:
 *         description: An error occurred while fetching daily items.
 */

app.get("/api/daily-items", async (req, res) => {
  try {
    const { userID } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const response = await axios.get(`${baseApiDomain}items/user_items_daily`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        filter: {
          UserID: { _eq: userID },
        },
        fields: ["*", "ItemID.*"],
      },
    });

    const dailyItems = response.data.data;
    res.status(200).json(dailyItems);
  } catch (error) {
    console.error("Error fetching daily items:", error);
    res.status(500).json({ message: "Failed to fetch daily items." });
  }
});

/**
 * @swagger
 * /api/initialize-daily-items:
 *   post:
 *     summary: Initialize daily items for a user
 *     description: Initialize daily items for a specific user by picking 10 random items from the game items and inserting them into user_items_daily.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The user's unique identifier.
 *             example:
 *               UserID: your_user_id_here
 *     responses:
 *       200:
 *         description: Daily items successfully initialized for the user.
 *       409:
 *         description: User already has daily items.
 *       500:
 *         description: An error occurred while initializing daily items.
 */
app.post("/api/initialize-daily-items", async (req, res) => {
  try {
    const { UserID } = req.body;

    // Check if user already has daily items
    const existingItemsResponse = await axios.get(
      `${baseApiDomain}items/user_items_daily`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { filter: { UserID: { _eq: UserID } } },
      }
    );

    if (existingItemsResponse.data.data.length > 0) {
      // User already has daily items
      return res.status(409).json({ message: "User already has daily items." });
    } else {
      // Fetch all game items
      const itemsResponse = await axios.get(
        `${baseApiDomain}items/game_items`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const allItems = itemsResponse.data.data;

      // Pick 10 random items
      const randomItems = allItems.sort(() => 0.5 - Math.random()).slice(0, 10);

      // Insert items into user_items_daily
      for (const item of randomItems) {
        await axios.post(
          `${baseApiDomain}items/user_items_daily`,
          {
            UserID: UserID,
            ItemID: item.id,
            Date: Math.round(new Date().getTime()), // Round to the nearest whole number
            IsPurchased: false,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }

      res.status(200).json({ message: "Daily items initialized for user." });
    }
  } catch (error) {
    console.error("Error initializing daily items:", error);
    res.status(500).json({ message: "Failed to initialize daily items." });
  }
});

// Function to log activity in the activity_log table
async function logActivity(userId, activityDetails) {
  const logData = {
    UserID: userId,
    ActivityType: activityDetails.type,
    ItemID: activityDetails.itemId || null,
    AmountSpent: activityDetails.amountSpent || null,
    PreviousCredits: activityDetails.previousCredits || null,
    NewCredits: activityDetails.newCredits || null,
    ActivityDate: Date.now(), // Current timestamp as an integer
    AdditionalDetails: activityDetails.additionalDetails, // Use passed details
  };

  await axios.post(`${baseApiDomain}items/activity_log`, logData, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// Define total interval hours for each event type
const intervalHours = {
  Feeding: 6,
  Drinking: 6,
  Cleaning: 24,
  Exercise: 12, // Assuming you will add this field to your Pet table
  HealthCheck: 48,
  Happiness: 24,
  MentalHealth: 16,
  Experience: 48, // Define the interval for Experience if needed
};

// Event type to Pet table field mapping
const eventTypeToField = {
  Feeding: "HungerLevel",
  Drink: "HydrationLevel",
  Cleaning: "CleanlinessLevel",
  Exercise: "ExerciseLevel", // Update this once you have the corresponding field in your Pet table
  HealthCheck: "HealthLevel",
  Happiness: "HappinessLevel",
  MentalHealth: "MentalHealthLevel",
  Experience: "ExperienceLevel",
};

// async function updatePetLevels() {
//   console.log('Fetching events...');
//   const now = new Date().getTime();
//   console.log(`Current time (now): ${now}`);

//   // Fetch all events
//   const eventsResponse = await axios.get(`${baseApiDomain}items/scheduled_events`, {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });
//   const events = eventsResponse.data.data;
//   console.log(`Found ${events.length} events to process.`);

//   for (let event of events) {
//     const fieldToUpdate = eventTypeToField[event.EventType];
//     if (!fieldToUpdate) {
//       console.log(`No matching field for EventType: ${event.EventType}`);
//       continue; // Skip this event if no matching field is found
//     }

//     // Fetch the pet data
//     const petResponse = await axios.get(`${baseApiDomain}items/pet/${event.PetID}`, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });
//     const pet = petResponse.data.data;

//     if (pet) {
//       const lastUpdateTimestamp = pet.LastUpdateTime || 0;
//       const timeSinceLastUpdate = (now - lastUpdateTimestamp) / (1000 * 60); // Time since last update in minutes
//       let newLevel = pet[fieldToUpdate];
//       const decreasePerHour = MAX_LEVEL / intervalHours[event.EventType];

//       if (now >= event.EventTime) {
//         newLevel = 0;
//       } else if (timeSinceLastUpdate >= 1) { // Check if at least 5 minutes have passed
//         const hoursUntilEvent = (event.EventTime - now) / (1000 * 60 * 60);
//         newLevel = pet[fieldToUpdate] - decreasePerHour * hoursUntilEvent;
//         newLevel = Math.max(newLevel, 0);
//       }
//       // const lastUpdateTimestamp = pet.LastUpdateTime || 0; // Use the last update time or 0 if it's not set
//       // const timeSinceLastUpdate = (now - lastUpdateTimestamp) / (1000 * 60 * 60); // Time since last update in hours
//       // const decreasePerHour = MAX_LEVEL / intervalHours[event.EventType];
//       // let newLevel = pet[fieldToUpdate];

//       // if (now >= event.EventTime) {
//       //   // Event is in the past, set level to 0
//       //   newLevel = 0;
//       // } else {
//       //   // Event is in the future, calculate the decrease only if enough time has passed since the last update
//       //   if (timeSinceLastUpdate * 60 >= 1) { // Check if at least 1 minute has passed
//       //     newLevel = pet[fieldToUpdate] - decreasePerHour * timeSinceLastUpdate;
//       //     newLevel = Math.max(newLevel, 0); // Ensure level doesn't go below 0
//       //   }
//       // }

//       console.log(`PetID ${pet.id}: Current ${fieldToUpdate} is ${pet[fieldToUpdate]}`);
//       console.log(`PetID ${pet.id}: New ${fieldToUpdate} is ${newLevel}`);
//       console.log(`Event time: ${event.EventTime}`);
//       console.log(`Last update time: ${lastUpdateTimestamp}`);
//       // Update the pet's level in the database
//       await axios.patch(`${baseApiDomain}items/pet/${pet.id}`, {
//         [fieldToUpdate]: newLevel,
//         LastUpdateTime: now // Update the LastUpdateTime field to the current timestamp
//       }, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//     } else {
//       console.log(`No pet found for PetID: ${event.PetID}`);
//     }
//   }

//   console.log('Levels updated for all pets.');
// }

// Constants for pet attribute levels and time calculation
const MAX_LEVEL = 100;
const SECONDS_PER_HOUR = 3600;
// Initialize a variable to track the time of the last function run
let lastRunTime = Date.now(); // Initialize with the current time

async function updatePetLevels() {
  // Get the current timestamp in milliseconds
  const now = new Date().getTime();
  console.log(`Running updatePetLevels at: ${new Date(now).toISOString()}`);

  // Calculate time since last run in seconds
  const timeSinceLastRun = (now - lastRunTime) / 1000;
  lastRunTime = now; // Update last run time

  // Fetch all scheduled events from the API
  const eventsResponse = await axios.get(
    `${baseApiDomain}items/scheduled_events`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const events = eventsResponse.data.data;
  console.log(`Found ${events.length} events to process.`);

  // Iterate through each scheduled event
  for (let event of events) {
    // Determine the pet attribute to update based on the event type
    const fieldToUpdate = eventTypeToField[event.EventType];

    // If no matching field is found for the event type, skip processing this event
    if (!fieldToUpdate) {
      console.log(`No matching field for EventType: ${event.EventType}`);
      continue;
    }

    // Fetch pet data associated with the event's PetID
    const petResponse = await axios.get(
      `${baseApiDomain}items/pet/${event.PetID}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const pet = petResponse.data.data;

    // If pet data is available for the PetID, update the pet's level
    if (pet) {
      let newLevel = pet[fieldToUpdate];
      const lastUpdateTimestamp = pet.LastUpdateTime || now; // Use current time if LastUpdateTime is not available
      const secondsSinceLastUpdate = (now - lastUpdateTimestamp) / 1000; // Time since last update in seconds
      const secondsUntilEvent = Math.max((event.EventTime - now) / 1000, 1); // Ensure it's at least 1 second
      const decreasePerSecond = MAX_LEVEL / secondsUntilEvent;

      console.log(`Processing PetID ${pet.id} for event ${event.EventType}`);
      console.log(`Current level: ${pet[fieldToUpdate]}`);
      console.log(
        `Time until event: ${(secondsUntilEvent / SECONDS_PER_HOUR).toFixed(
          2
        )} hours (${secondsUntilEvent.toFixed(0)} seconds)`
      );
      console.log(`Decrease per second: ${decreasePerSecond}`);

      if (now >= event.EventTime) {
        newLevel = 0;
      } else {
        newLevel =
          pet[fieldToUpdate] -
          (decreasePerSecond * (now - lastUpdateTimestamp)) / 1000;
        newLevel = Math.max(newLevel, 0);
      }

      console.log(
        `Updating PetID ${pet.id}: ${fieldToUpdate} from ${pet[fieldToUpdate]} to ${newLevel}`
      );

      console.log(`Processing PetID ${pet.id} for event ${event.EventType}`);
      console.log(`Current level: ${newLevel}`);
      console.log(`Seconds until event: ${secondsUntilEvent}`);
      console.log(`Decrease per second: ${decreasePerSecond}`);

      if (now >= event.EventTime) {
        newLevel = 0;
        console.log(`Event is in the past. Setting level to 0.`);
      } else {
        // Calculate how much to decrease based on time since last run
        newLevel = pet[fieldToUpdate] - decreasePerSecond * timeSinceLastRun;
        newLevel = Math.max(newLevel, 0);

        console.log(`Calculated new level: ${newLevel}`);
      }

      console.log(
        `Updating PetID ${pet.id}: ${fieldToUpdate} from ${pet[fieldToUpdate]} to ${newLevel}`
      );

      // Update the pet's level in the database
      await axios.patch(
        `${baseApiDomain}items/pet/${pet.id}`,
        {
          [fieldToUpdate]: newLevel,
          LastUpdateTime: now, // Update the LastUpdateTime field to the current timestamp
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    } else {
      console.log(`No pet found for PetID: ${event.PetID}`);
    }
  }

  console.log("All pet levels have been updated.");
  console.log("---------------NEXT UPDATE-----------------");
}

// Run the function immediately and then every 10 seconds
// updatePetLevels().catch(console.error);
// setInterval(() => {
//   updatePetLevels().catch(console.error);
// }, 20000);

// const MAX_LEVEL = 100;
// const TOTAL_FEED_INTERVAL_HOURS = 6; // 6 hours for feeding interval
// const DECREMENT_PER_HOUR = MAX_LEVEL / TOTAL_FEED_INTERVAL_HOURS;

// async function updatePetHungerLevels() {
//   console.log('Fetching Feeding events...');

//   // Get current timestamp
//   const now = new Date().getTime();

//   const eventsResponse = await axios.get(`${baseApiDomain}items/scheduled_events`, {
//     headers: { Authorization: `Bearer ${accessToken}` },
//     params: {
//       filter: {
//         EventType: { _eq: 'Feeding' },
//       },
//     },
//   });

//   const events = eventsResponse.data.data;
//   console.log(`Found ${events.length} Feeding events to process.`);

//   for (let event of events) {
//     console.log(`Event ID: ${event.id}, Event Time: ${event.EventTime}, PetID: ${event.PetID}`);
//     const timeSinceEvent = (now - event.EventTime) / (1000 * 60 * 60); // Time since event in hours

//     if (now > event.EventTime) {
//       const petResponse = await axios.get(`${baseApiDomain}items/pet/${event.PetID}`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       if (petResponse.data.data) {
//         const pet = petResponse.data.data;
//         console.log(`PetID ${pet.id}: Current HungerLevel is ${pet.HungerLevel}`);

//         let newHungerLevel = pet.HungerLevel - (DECREMENT_PER_HOUR * timeSinceEvent);
//         newHungerLevel = Math.max(newHungerLevel, 0);
//         console.log(`PetID ${pet.id}: New HungerLevel is ${newHungerLevel}`);

//         await axios.patch(`${baseApiDomain}items/pet/${pet.id}`, {
//           HungerLevel: newHungerLevel,
//         }, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });
//       } else {
//         console.log(`No pet found for PetID: ${event.PetID}`);
//       }
//     }
//   }

//   console.log('Hunger levels updated for all pets.');
// }

// updatePetHungerLevels().catch(console.error);

//const MAX_LEVEL = 100;
// async function updatePetStatus() {
//   console.log('Fetching scheduled events...');

//   // Fetch the scheduled events from your Directus API
//   const now = new Date().getTime(); // Current timestamp in milliseconds

// const eventsResponse = await axios.get(`${baseApiDomain}items/scheduled_events`, {
//   headers: {
//     Authorization: `Bearer ${accessToken}`,
//   },
//   params: {
//     filter: {
//       EventTime: {
//         _lte: now, // Use the timestamp for comparison
//       },
//       IsCompleted: {
//         _eq: false,
//       },
//     },
//   },
// });
//   const events = eventsResponse.data.data;
//   console.log(`Found ${events.length} events to process.`);

//   // Loop through each event and update pet status
//   for (let event of events) {
//     console.log(`Processing event ID: ${event.id} for PetID: ${event.PetID}`);

//     const petId = event.PetID;
//     // Fetch the pet data
//     console.log(`Fetching data for PetID: ${petId}`);

//     const petResponse = await axios.get(`${baseApiDomain}items/pet/${petId}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     const pet = petResponse.data.data;
//     console.log(`Updating status for PetID: ${petId} based on event type: ${event.EventType}`);

//     // Depending on the event type, update the pet's status
//     if (event.EventType === 'Feeding' && pet.HungerLevel < MAX_LEVEL) {
//       pet.HungerLevel = Math.min(pet.HungerLevel + 10, MAX_LEVEL);
//     } else if (event.EventType === 'Cleaning' && pet.CleanlinessLevel < MAX_LEVEL) {
//       pet.CleanlinessLevel = Math.min(pet.CleanlinessLevel + 10, MAX_LEVEL);
//     }
//     // ... handle other event types similarly
//     console.log(`Patching PetID: ${petId} with updated status.`);

//     // Update the pet record in your Directus database
//     await axios.patch(`${baseApiDomain}items/pet/${petId}`, {
//       HungerLevel: pet.HungerLevel,
//       CleanlinessLevel: pet.CleanlinessLevel,
//       // ... other pet attributes as needed
//     }, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     console.log(`Marking event ID: ${event.id} as completed.`);

//     // Update the event as completed
//     await axios.patch(`${baseApiDomain}items/scheduled_events/${event.id}`, {
//       IsCompleted: true,
//       EventTime: calculateNextEventTime(event.EventType),
//     }, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//   }
//   console.log('All events processed.');

// }
//updatePetStatus().catch(console.error);

// helper functions

function formatTimestamp(timestamp) {
  // Create a Date object from the timestamp
  const date = new Date(timestamp);
  // Format the date into a readable string
  return format(date, "PPpp");
}
function convertToTimestamp(dateString) {
  const date = new Date(dateString);
  return date.getTime();
}
console.log(convertToTimestamp("2024-01-31T16:10:12.981Z"));
console.log(formatTimestamp(1706718431404));
function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function generateCatName() {
  var name1 = [
    "abandoned",
    "able",
    "absolute",
    "adorable",
    "adventurous",
    "academic",
    "acceptable",
    "acclaimed",
    "accomplished",
    "accurate",
    "aching",
    "acidic",
    "acrobatic",
    "active",
    "actual",
    "adept",
    "admirable",
    "admired",
    "adolescent",
    "adorable",
    "adored",
    "advanced",
    "afraid",
    "affectionate",
    "aged",
    "aggravating",
    "aggressive",
    "agile",
    "agitated",
    "agonizing",
    "agreeable",
    "ajar",
    "alarmed",
    "alarming",
    "alert",
    "alienated",
    "alive",
    "all",
    "altruistic",
    "amazing",
    "ambitious",
    "ample",
    "amused",
    "amusing",
    "anchored",
    "ancient",
    "angelic",
    "angry",
    "anguished",
    "animated",
    "annual",
    "another",
    "antique",
    "anxious",
    "any",
    "apprehensive",
    "appropriate",
    "apt",
    "arctic",
    "arid",
    "aromatic",
    "artistic",
    "ashamed",
    "assured",
    "astonishing",
    "athletic",
    "attached",
    "attentive",
    "attractive",
    "austere",
    "authentic",
    "authorized",
    "automatic",
    "avaricious",
    "average",
    "aware",
    "awesome",
    "awful",
    "awkward",
    "babyish",
    "bad",
    "back",
    "baggy",
    "bare",
    "barren",
    "basic",
    "beautiful",
    "belated",
    "beloved",
    "beneficial",
    "better",
    "best",
    "bewitched",
    "big",
    "big-hearted",
    "biodegradable",
    "bite-sized",
    "bitter",
    "black",
    "black-and-white",
    "bland",
    "blank",
    "blaring",
    "bleak",
    "blind",
    "blissful",
    "blond",
    "blue",
    "blushing",
    "bogus",
    "boiling",
    "bold",
    "bony",
    "boring",
    "bossy",
    "both",
    "bouncy",
    "bountiful",
    "bowed",
    "brave",
    "breakable",
    "brief",
    "bright",
    "brilliant",
    "brisk",
    "broken",
    "bronze",
    "brown",
    "bruised",
    "bubbly",
    "bulky",
    "bumpy",
    "buoyant",
    "burdensome",
    "burly",
    "bustling",
    "busy",
    "buttery",
    "buzzing",
    "calculating",
    "calm",
    "candid",
    "canine",
    "capital",
    "carefree",
    "careful",
    "careless",
    "caring",
    "cautious",
    "cavernous",
    "celebrated",
    "charming",
    "cheap",
    "cheerful",
    "cheery",
    "chief",
    "chilly",
    "chubby",
    "circular",
    "classic",
    "clean",
    "clear",
    "clear-cut",
    "clever",
    "close",
    "closed",
    "cloudy",
    "clueless",
    "clumsy",
    "cluttered",
    "coarse",
    "cold",
    "colorful",
    "colorless",
    "colossal",
    "comfortable",
    "common",
    "compassionate",
    "competent",
    "complete",
    "complex",
    "complicated",
    "composed",
    "concerned",
    "concrete",
    "confused",
    "conscious",
    "considerate",
    "constant",
    "content",
    "conventional",
    "cooked",
    "cool",
    "cooperative",
    "coordinated",
    "corny",
    "corrupt",
    "costly",
    "courageous",
    "courteous",
    "crafty",
    "crazy",
    "creamy",
    "creative",
    "creepy",
    "criminal",
    "crisp",
    "critical",
    "crooked",
    "crowded",
    "cruel",
    "crushing",
    "cuddly",
    "cultivated",
    "cultured",
    "cumbersome",
    "curly",
    "curvy",
    "cute",
    "cylindrical",
    "damaged",
    "damp",
    "dangerous",
    "dapper",
    "daring",
    "darling",
    "dark",
    "dazzling",
    "dead",
    "deadly",
    "deafening",
    "dear",
    "dearest",
    "decent",
    "decimal",
    "decisive",
    "deep",
    "defenseless",
    "defensive",
    "defiant",
    "deficient",
    "definite",
    "definitive",
    "delayed",
    "delectable",
    "delicious",
    "delightful",
    "delirious",
    "demanding",
    "dense",
    "dental",
    "dependable",
    "dependent",
    "descriptive",
    "deserted",
    "detailed",
    "determined",
    "devoted",
    "different",
    "difficult",
    "digital",
    "diligent",
    "dim",
    "dimpled",
    "dimwitted",
    "direct",
    "disastrous",
    "discrete",
    "disfigured",
    "disgusting",
    "disloyal",
    "dismal",
    "distant",
    "downright",
    "dreary",
    "dirty",
    "disguised",
    "dishonest",
    "dismal",
    "distant",
    "distinct",
    "distorted",
    "dizzy",
    "dopey",
    "doting",
    "double",
    "downright",
    "drab",
    "drafty",
    "dramatic",
    "dreary",
    "droopy",
    "dry",
    "dual",
    "dull",
    "dutiful",
    "each",
    "eager",
    "earnest",
    "early",
    "easy",
    "easy-going",
    "ecstatic",
    "edible",
    "educated",
    "elaborate",
    "elastic",
    "elated",
    "elderly",
    "electric",
    "elegant",
    "elementary",
    "elliptical",
    "embarrassed",
    "embellished",
    "eminent",
    "emotional",
    "empty",
    "enchanted",
    "enchanting",
    "energetic",
    "enlightened",
    "enormous",
    "enraged",
    "entire",
    "envious",
    "equal",
    "equatorial",
    "essential",
    "esteemed",
    "ethical",
    "euphoric",
    "even",
    "evergreen",
    "everlasting",
    "every",
    "evil",
    "exalted",
    "excellent",
    "exemplary",
    "exhausted",
    "excitable",
    "excited",
    "exciting",
    "exotic",
    "expensive",
    "experienced",
    "expert",
    "extraneous",
    "extroverted",
    "extra-large",
    "extra-small",
    "fabulous",
    "failing",
    "faint",
    "fair",
    "faithful",
    "fake",
    "false",
    "familiar",
    "famous",
    "fancy",
    "fantastic",
    "far",
    "faraway",
    "far-flung",
    "far-off",
    "fast",
    "fat",
    "fatal",
    "fatherly",
    "favorable",
    "favorite",
    "fearful",
    "fearless",
    "feisty",
    "feline",
    "female",
    "feminine",
    "few",
    "fickle",
    "filthy",
    "fine",
    "finished",
    "firm",
    "first",
    "firsthand",
    "fitting",
    "fixed",
    "flaky",
    "flamboyant",
    "flashy",
    "flat",
    "flawed",
    "flawless",
    "flickering",
    "flimsy",
    "flippant",
    "flowery",
    "fluffy",
    "fluid",
    "flustered",
    "focused",
    "fond",
    "foolhardy",
    "foolish",
    "forceful",
    "forked",
    "formal",
    "forsaken",
    "forthright",
    "fortunate",
    "fragrant",
    "frail",
    "frank",
    "frayed",
    "free",
    "French",
    "fresh",
    "frequent",
    "friendly",
    "frightened",
    "frightening",
    "frigid",
    "frilly",
    "frizzy",
    "frivolous",
    "front",
    "frosty",
    "frozen",
    "frugal",
    "fruitful",
    "full",
    "fumbling",
    "functional",
    "funny",
    "fussy",
    "fuzzy",
    "gargantuan",
    "gaseous",
    "general",
    "generous",
    "gentle",
    "genuine",
    "giant",
    "giddy",
    "gigantic",
    "gifted",
    "giving",
    "glamorous",
    "glaring",
    "glass",
    "gleaming",
    "gleeful",
    "glistening",
    "glittering",
    "gloomy",
    "glorious",
    "glossy",
    "glum",
    "golden",
    "good",
    "good-natured",
    "gorgeous",
    "graceful",
    "gracious",
    "grand",
    "grandiose",
    "granular",
    "grateful",
    "grave",
    "gray",
    "great",
    "greedy",
    "green",
    "gregarious",
    "grim",
    "grimy",
    "gripping",
    "grizzled",
    "gross",
    "grotesque",
    "grouchy",
    "grounded",
    "growing",
    "growling",
    "grown",
    "grubby",
    "gruesome",
    "grumpy",
    "guilty",
    "gullible",
    "gummy",
    "hairy",
    "half",
    "handmade",
    "handsome",
    "handy",
    "happy",
    "happy-go-lucky",
    "hard",
    "hard-to-find",
    "harmful",
    "harmless",
    "harmonious",
    "harsh",
    "hasty",
    "hateful",
    "haunting",
    "healthy",
    "heartfelt",
    "hearty",
    "heavenly",
    "heavy",
    "hefty",
    "helpful",
    "helpless",
    "hidden",
    "hideous",
    "high",
    "high-level",
    "hilarious",
    "hoarse",
    "hollow",
    "homely",
    "honest",
    "honorable",
    "honored",
    "hopeful",
    "horrible",
    "hospitable",
    "hot",
    "huge",
    "humble",
    "humiliating",
    "humming",
    "humongous",
    "hungry",
    "hurtful",
    "husky",
    "icky",
    "icy",
    "ideal",
    "idealistic",
    "identical",
    "idle",
    "idiotic",
    "idolized",
    "ignorant",
    "ill",
    "illegal",
    "ill-fated",
    "ill-informed",
    "illiterate",
    "illustrious",
    "imaginary",
    "imaginative",
    "immaculate",
    "immaterial",
    "immediate",
    "immense",
    "impassioned",
    "impeccable",
    "impartial",
    "imperfect",
    "imperturbable",
    "impish",
    "impolite",
    "important",
    "impossible",
    "impractical",
    "impressionable",
    "impressive",
    "improbable",
    "impure",
    "inborn",
    "incomparable",
    "incompatible",
    "incomplete",
    "inconsequential",
    "incredible",
    "indelible",
    "inexperienced",
    "indolent",
    "infamous",
    "infantile",
    "infatuated",
    "inferior",
    "infinite",
    "informal",
    "innocent",
    "insecure",
    "insidious",
    "insignificant",
    "insistent",
    "instructive",
    "insubstantial",
    "intelligent",
    "intent",
    "intentional",
    "interesting",
    "internal",
    "international",
    "intrepid",
    "ironclad",
    "irresponsible",
    "irritating",
    "itchy",
    "jaded",
    "jagged",
    "jam-packed",
    "jaunty",
    "jealous",
    "jittery",
    "joint",
    "jolly",
    "jovial",
    "joyful",
    "joyous",
    "jubilant",
    "judicious",
    "juicy",
    "jumbo",
    "junior",
    "jumpy",
    "juvenile",
    "kaleidoscopic",
    "keen",
    "key",
    "kind",
    "kindhearted",
    "kindly",
    "klutzy",
    "knobby",
    "knotty",
    "knowledgeable",
    "knowing",
    "known",
    "kooky",
    "kosher",
    "lame",
    "lanky",
    "large",
    "last",
    "lasting",
    "late",
    "lavish",
    "lawful",
    "lazy",
    "leading",
    "lean",
    "leafy",
    "left",
    "legal",
    "legitimate",
    "light",
    "lighthearted",
    "likable",
    "likely",
    "limited",
    "limp",
    "limping",
    "linear",
    "lined",
    "liquid",
    "little",
    "live",
    "lively",
    "livid",
    "loathsome",
    "lone",
    "lonely",
    "long",
    "long-term",
    "loose",
    "lopsided",
    "lost",
    "loud",
    "lovable",
    "lovely",
    "loving",
    "low",
    "loyal",
    "lucky",
    "lumbering",
    "luminous",
    "lumpy",
    "lustrous",
    "luxurious",
    "mad",
    "made-up",
    "magnificent",
    "majestic",
    "major",
    "male",
    "mammoth",
    "married",
    "marvelous",
    "masculine",
    "massive",
    "mature",
    "meager",
    "mealy",
    "mean",
    "measly",
    "meaty",
    "medical",
    "mediocre",
    "medium",
    "meek",
    "mellow",
    "melodic",
    "memorable",
    "menacing",
    "merry",
    "messy",
    "metallic",
    "mild",
    "milky",
    "mindless",
    "miniature",
    "minor",
    "minty",
    "miserable",
    "miserly",
    "misguided",
    "misty",
    "mixed",
    "modern",
    "modest",
    "moist",
    "monstrous",
    "monthly",
    "monumental",
    "moral",
    "mortified",
    "motherly",
    "motionless",
    "mountainous",
    "muddy",
    "muffled",
    "multicolored",
    "mundane",
    "murky",
    "mushy",
    "musty",
    "muted",
    "mysterious",
    "naive",
    "narrow",
    "nasty",
    "natural",
    "naughty",
    "nautical",
    "near",
    "neat",
    "necessary",
    "needy",
    "negative",
    "neglected",
    "negligible",
    "neighboring",
    "nervous",
    "new",
    "next",
    "nice",
    "nifty",
    "nimble",
    "nippy",
    "nocturnal",
    "noisy",
    "nonstop",
    "normal",
    "notable",
    "noted",
    "noteworthy",
    "novel",
    "noxious",
    "numb",
    "nutritious",
    "nutty",
    "obedient",
    "obese",
    "oblong",
    "oily",
    "oblong",
    "obvious",
    "occasional",
    "odd",
    "oddball",
    "offbeat",
    "offensive",
    "official",
    "old",
    "old-fashioned",
    "only",
    "open",
    "optimal",
    "optimistic",
    "opulent",
    "orange",
    "orderly",
    "organic",
    "ornate",
    "ornery",
    "ordinary",
    "original",
    "other",
    "our",
    "outlying",
    "outgoing",
    "outlandish",
    "outrageous",
    "outstanding",
    "oval",
    "overcooked",
    "overdue",
    "overjoyed",
    "overlooked",
    "palatable",
    "pale",
    "paltry",
    "parallel",
    "parched",
    "partial",
    "passionate",
    "past",
    "pastel",
    "peaceful",
    "peppery",
    "perfect",
    "perfumed",
    "periodic",
    "perky",
    "personal",
    "pertinent",
    "pesky",
    "pessimistic",
    "petty",
    "phony",
    "physical",
    "piercing",
    "pink",
    "pitiful",
    "plain",
    "plaintive",
    "plastic",
    "playful",
    "pleasant",
    "pleased",
    "pleasing",
    "plump",
    "plush",
    "polished",
    "polite",
    "political",
    "pointed",
    "pointless",
    "poised",
    "poor",
    "popular",
    "portly",
    "posh",
    "positive",
    "possible",
    "potable",
    "powerful",
    "powerless",
    "practical",
    "precious",
    "present",
    "prestigious",
    "pretty",
    "precious",
    "previous",
    "pricey",
    "prickly",
    "primary",
    "prime",
    "pristine",
    "private",
    "prize",
    "probable",
    "productive",
    "profitable",
    "profuse",
    "proper",
    "proud",
    "prudent",
    "punctual",
    "pungent",
    "puny",
    "pure",
    "purple",
    "pushy",
    "putrid",
    "puzzled",
    "puzzling",
    "quaint",
    "qualified",
    "quarrelsome",
    "quarterly",
    "queasy",
    "querulous",
    "questionable",
    "quick",
    "quick-witted",
    "quiet",
    "quintessential",
    "quirky",
    "quixotic",
    "quizzical",
    "radiant",
    "ragged",
    "rapid",
    "rare",
    "rash",
    "raw",
    "recent",
    "reckless",
    "rectangular",
    "ready",
    "real",
    "realistic",
    "reasonable",
    "red",
    "reflecting",
    "regal",
    "regular",
    "reliable",
    "relieved",
    "remarkable",
    "remorseful",
    "remote",
    "repentant",
    "required",
    "respectful",
    "responsible",
    "repulsive",
    "revolving",
    "rewarding",
    "rich",
    "rigid",
    "right",
    "ringed",
    "ripe",
    "roasted",
    "robust",
    "rosy",
    "rotating",
    "rotten",
    "rough",
    "round",
    "rowdy",
    "royal",
    "rubbery",
    "rundown",
    "ruddy",
    "rude",
    "runny",
    "rural",
    "rusty",
    "sad",
    "safe",
    "salty",
    "same",
    "sandy",
    "sane",
    "sarcastic",
    "sardonic",
    "satisfied",
    "scaly",
    "scarce",
    "scared",
    "scary",
    "scented",
    "scholarly",
    "scientific",
    "scornful",
    "scratchy",
    "scrawny",
    "second",
    "secondary",
    "second-hand",
    "secret",
    "self-assured",
    "self-reliant",
    "selfish",
    "sentimental",
    "separate",
    "serene",
    "serious",
    "serpentine",
    "several",
    "severe",
    "shabby",
    "shadowy",
    "shady",
    "shallow",
    "shameful",
    "shameless",
    "sharp",
    "shimmering",
    "shiny",
    "shocked",
    "shocking",
    "shoddy",
    "short",
    "short-term",
    "showy",
    "shrill",
    "shy",
    "sick",
    "silent",
    "silky",
    "silly",
    "silver",
    "similar",
    "simple",
    "simplistic",
    "sinful",
    "single",
    "sizzling",
    "skeletal",
    "skinny",
    "sleepy",
    "slight",
    "slim",
    "slimy",
    "slippery",
    "slow",
    "slushy",
    "small",
    "smart",
    "smoggy",
    "smooth",
    "smug",
    "snappy",
    "snarling",
    "sneaky",
    "sniveling",
    "snoopy",
    "sociable",
    "soft",
    "soggy",
    "solid",
    "somber",
    "some",
    "spherical",
    "sophisticated",
    "sore",
    "sorrowful",
    "soulful",
    "soupy",
    "sour",
    "Spanish",
    "sparkling",
    "sparse",
    "specific",
    "spectacular",
    "speedy",
    "spicy",
    "spiffy",
    "spirited",
    "spiteful",
    "splendid",
    "spotless",
    "spotted",
    "spry",
    "square",
    "squeaky",
    "squiggly",
    "stable",
    "staid",
    "stained",
    "stale",
    "standard",
    "starchy",
    "stark",
    "starry",
    "steep",
    "sticky",
    "stiff",
    "stimulating",
    "stingy",
    "stormy",
    "straight",
    "strange",
    "steel",
    "strict",
    "strident",
    "striking",
    "striped",
    "strong",
    "studious",
    "stunning",
    "stupendous",
    "stupid",
    "sturdy",
    "stylish",
    "subdued",
    "submissive",
    "substantial",
    "subtle",
    "suburban",
    "sudden",
    "sugary",
    "sunny",
    "super",
    "superb",
    "superficial",
    "superior",
    "supportive",
    "sure-footed",
    "surprised",
    "suspicious",
    "svelte",
    "sweaty",
    "sweet",
    "sweltering",
    "swift",
    "sympathetic",
    "tall",
    "talkative",
    "tame",
    "tan",
    "tangible",
    "tart",
    "tasty",
    "tattered",
    "taut",
    "tedious",
    "teeming",
    "tempting",
    "tender",
    "tense",
    "tepid",
    "terrible",
    "terrific",
    "testy",
    "thankful",
    "that",
    "these",
    "thick",
    "thin",
    "third",
    "thirsty",
    "this",
    "thorough",
    "thorny",
    "those",
    "thoughtful",
    "threadbare",
    "thrifty",
    "thunderous",
    "tidy",
    "tight",
    "timely",
    "tinted",
    "tiny",
    "tired",
    "torn",
    "total",
    "tough",
    "traumatic",
    "treasured",
    "tremendous",
    "tragic",
    "trained",
    "tremendous",
    "triangular",
    "tricky",
    "trifling",
    "trim",
    "trivial",
    "troubled",
    "true",
    "trusting",
    "trustworthy",
    "trusty",
    "truthful",
    "tubby",
    "turbulent",
    "twin",
    "ugly",
    "ultimate",
    "unacceptable",
    "unaware",
    "uncomfortable",
    "uncommon",
    "unconscious",
    "understated",
    "unequaled",
    "uneven",
    "unfinished",
    "unfit",
    "unfolded",
    "unfortunate",
    "unhappy",
    "unhealthy",
    "uniform",
    "unimportant",
    "unique",
    "united",
    "unkempt",
    "unknown",
    "unlawful",
    "unlined",
    "unlucky",
    "unnatural",
    "unpleasant",
    "unrealistic",
    "unripe",
    "unruly",
    "unselfish",
    "unsightly",
    "unsteady",
    "unsung",
    "untidy",
    "untimely",
    "untried",
    "untrue",
    "unused",
    "unusual",
    "unwelcome",
    "unwieldy",
    "unwilling",
    "unwitting",
    "unwritten",
    "upbeat",
    "upright",
    "upset",
    "urban",
    "usable",
    "used",
    "useful",
    "useless",
    "utilized",
    "utter",
    "vacant",
    "vague",
    "vain",
    "valid",
    "valuable",
    "vapid",
    "variable",
    "vast",
    "velvety",
    "venerated",
    "vengeful",
    "verifiable",
    "vibrant",
    "vicious",
    "victorious",
    "vigilant",
    "vigorous",
    "villainous",
    "violet",
    "violent",
    "virtual",
    "virtuous",
    "visible",
    "vital",
    "vivacious",
    "vivid",
    "voluminous",
    "wan",
    "warlike",
    "warm",
    "warmhearted",
    "warped",
    "wary",
    "wasteful",
    "watchful",
    "waterlogged",
    "watery",
    "wavy",
    "wealthy",
    "weak",
    "weary",
    "webbed",
    "wee",
    "weekly",
    "weepy",
    "weighty",
    "weird",
    "welcome",
    "well-documented",
    "well-groomed",
    "well-informed",
    "well-lit",
    "well-made",
    "well-off",
    "well-to-do",
    "well-worn",
    "wet",
    "which",
    "whimsical",
    "whirlwind",
    "whispered",
    "white",
    "whole",
    "whopping",
    "wicked",
    "wide",
    "wide-eyed",
    "wiggly",
    "wild",
    "willing",
    "wilted",
    "winding",
    "windy",
    "winged",
    "wiry",
    "wise",
    "witty",
    "wobbly",
    "woeful",
    "wonderful",
    "wooden",
    "woozy",
    "wordy",
    "worldly",
    "worn",
    "worried",
    "worrisome",
    "worse",
    "worst",
    "worthless",
    "worthwhile",
    "worthy",
    "wrathful",
    "wretched",
    "writhing",
    "wrong",
    "wry",
    "yawning",
    "yearly",
    "yellow",
    "yellowish",
    "young",
    "youthful",
    "yummy",
    "zany",
    "zealous",
    "zesty",
    "zigzag",
    "rocky",
  ];

  var name2 = [
    "people",
    "history",
    "way",
    "art",
    "world",
    "information",
    "map",
    "family",
    "government",
    "health",
    "system",
    "computer",
    "meat",
    "year",
    "thanks",
    "music",
    "person",
    "reading",
    "method",
    "data",
    "food",
    "understanding",
    "theory",
    "law",
    "bird",
    "literature",
    "problem",
    "software",
    "control",
    "knowledge",
    "power",
    "ability",
    "economics",
    "love",
    "internet",
    "television",
    "science",
    "library",
    "nature",
    "fact",
    "product",
    "idea",
    "temperature",
    "investment",
    "area",
    "society",
    "activity",
    "story",
    "industry",
    "media",
    "thing",
    "oven",
    "community",
    "definition",
    "safety",
    "quality",
    "development",
    "language",
    "management",
    "player",
    "variety",
    "video",
    "week",
    "security",
    "country",
    "exam",
    "movie",
    "organization",
    "equipment",
    "physics",
    "analysis",
    "policy",
    "series",
    "thought",
    "basis",
    "boyfriend",
    "direction",
    "strategy",
    "technology",
    "army",
    "camera",
    "freedom",
    "paper",
    "environment",
    "child",
    "instance",
    "month",
    "truth",
    "marketing",
    "university",
    "writing",
    "article",
    "department",
    "difference",
    "goal",
    "news",
    "audience",
    "fishing",
    "growth",
    "income",
    "marriage",
    "user",
    "combination",
    "failure",
    "meaning",
    "medicine",
    "philosophy",
    "teacher",
    "communication",
    "night",
    "chemistry",
    "disease",
    "disk",
    "energy",
    "nation",
    "road",
    "role",
    "soup",
    "advertising",
    "location",
    "success",
    "addition",
    "apartment",
    "education",
    "math",
    "moment",
    "painting",
    "politics",
    "attention",
    "decision",
    "event",
    "property",
    "shopping",
    "student",
    "wood",
    "competition",
    "distribution",
    "entertainment",
    "office",
    "population",
    "president",
    "unit",
    "category",
    "cigarette",
    "context",
    "introduction",
    "opportunity",
    "performance",
    "driver",
    "flight",
    "length",
    "magazine",
    "newspaper",
    "relationship",
    "teaching",
    "cell",
    "dealer",
    "debate",
    "finding",
    "lake",
    "member",
    "message",
    "phone",
    "scene",
    "appearance",
    "association",
    "concept",
    "customer",
    "death",
    "discussion",
    "housing",
    "inflation",
    "insurance",
    "mood",
    "woman",
    "advice",
    "blood",
    "effort",
    "expression",
    "importance",
    "opinion",
    "payment",
    "reality",
    "responsibility",
    "situation",
    "skill",
    "statement",
    "wealth",
    "application",
    "city",
    "county",
    "depth",
    "estate",
    "foundation",
    "grandmother",
    "heart",
    "perspective",
    "photo",
    "recipe",
    "studio",
    "topic",
    "collection",
    "depression",
    "imagination",
    "passion",
    "percentage",
    "resource",
    "setting",
    "ad",
    "agency",
    "college",
    "connection",
    "criticism",
    "debt",
    "description",
    "memory",
    "patience",
    "secretary",
    "solution",
    "administration",
    "aspect",
    "attitude",
    "director",
    "personality",
    "psychology",
    "recommendation",
    "response",
    "selection",
    "storage",
    "version",
    "alcohol",
    "argument",
    "complaint",
    "contract",
    "emphasis",
    "highway",
    "loss",
    "membership",
    "possession",
    "preparation",
    "steak",
    "union",
    "agreement",
    "cancer",
    "currency",
    "employment",
    "engineering",
    "entry",
    "interaction",
    "limit",
    "mixture",
    "preference",
    "region",
    "republic",
    "seat",
    "tradition",
    "virus",
    "actor",
    "classroom",
    "delivery",
    "device",
    "difficulty",
    "drama",
    "election",
    "engine",
    "football",
    "guidance",
    "hotel",
    "match",
    "owner",
    "priority",
    "protection",
    "suggestion",
    "tension",
    "variation",
    "anxiety",
    "atmosphere",
    "awareness",
    "bread",
    "climate",
    "comparison",
    "confusion",
    "construction",
    "elevator",
    "emotion",
    "employee",
    "employer",
    "guest",
    "height",
    "leadership",
    "mall",
    "manager",
    "operation",
    "recording",
    "respect",
    "sample",
    "transportation",
    "boring",
    "charity",
    "cousin",
    "disaster",
    "editor",
    "efficiency",
    "excitement",
    "extent",
    "feedback",
    "guitar",
    "homework",
    "leader",
    "mom",
    "outcome",
    "permission",
    "presentation",
    "promotion",
    "reflection",
    "refrigerator",
    "resolution",
    "revenue",
    "session",
    "singer",
    "tennis",
    "basket",
    "bonus",
    "cabinet",
    "childhood",
    "church",
    "clothes",
    "coffee",
    "dinner",
    "drawing",
    "hair",
    "hearing",
    "initiative",
    "judgment",
    "lab",
    "measurement",
    "mode",
    "mud",
    "orange",
    "poetry",
    "police",
    "possibility",
    "procedure",
    "queen",
    "ratio",
    "relation",
    "restaurant",
    "satisfaction",
    "sector",
    "signature",
    "significance",
    "song",
    "tooth",
    "town",
    "vehicle",
    "volume",
    "wife",
    "accident",
    "airport",
    "appointment",
    "arrival",
    "assumption",
    "baseball",
    "chapter",
    "committee",
    "conversation",
    "database",
    "enthusiasm",
    "error",
    "explanation",
    "farmer",
    "gate",
    "girl",
    "hall",
    "historian",
    "hospital",
    "injury",
    "instruction",
    "maintenance",
    "manufacturer",
    "meal",
    "perception",
    "pie",
    "poem",
    "presence",
    "proposal",
    "reception",
    "replacement",
    "revolution",
    "river",
    "son",
    "speech",
    "tea",
    "village",
    "warning",
    "winner",
    "worker",
    "writer",
    "assistance",
    "breath",
    "buyer",
    "chest",
    "chocolate",
    "conclusion",
    "contribution",
    "cookie",
    "courage",
    "desk",
    "drawer",
    "establishment",
    "examination",
    "garbage",
    "grocery",
    "honey",
    "impression",
    "improvement",
    "independence",
    "insect",
    "inspection",
    "inspector",
    "king",
    "ladder",
    "menu",
    "penalty",
    "piano",
    "potato",
    "profession",
    "professor",
    "quantity",
    "reaction",
    "requirement",
    "salad",
    "sister",
    "supermarket",
    "tongue",
    "weakness",
    "wedding",
    "affair",
    "ambition",
    "analyst",
    "apple",
    "assignment",
    "assistant",
    "bathroom",
    "bedroom",
    "beer",
    "birthday",
    "celebration",
    "championship",
    "cheek",
    "client",
    "consequence",
    "departure",
    "diamond",
    "dirt",
    "ear",
    "fortune",
    "friendship",
    "funeral",
    "gene",
    "girlfriend",
    "hat",
    "indication",
    "intention",
    "lady",
    "midnight",
    "negotiation",
    "obligation",
    "passenger",
    "pizza",
    "platform",
    "poet",
    "pollution",
    "recognition",
    "reputation",
    "shirt",
    "speaker",
    "stranger",
    "surgery",
    "sympathy",
    "tale",
    "throat",
    "trainer",
    "uncle",
    "youth",
    "time",
    "work",
    "film",
    "water",
    "money",
    "example",
    "while",
    "business",
    "study",
    "game",
    "life",
    "form",
    "air",
    "day",
    "place",
    "number",
    "part",
    "field",
    "fish",
    "back",
    "process",
    "heat",
    "hand",
    "experience",
    "job",
    "book",
    "end",
    "point",
    "type",
    "home",
    "economy",
    "value",
    "body",
    "market",
    "guide",
    "interest",
    "state",
    "radio",
    "course",
    "company",
    "price",
    "size",
    "card",
    "list",
    "mind",
    "trade",
    "line",
    "care",
    "group",
    "risk",
    "word",
    "fat",
    "force",
    "key",
    "light",
    "training",
    "name",
    "school",
    "top",
    "amount",
    "level",
    "order",
    "practice",
    "research",
    "sense",
    "service",
    "piece",
    "web",
    "boss",
    "sport",
    "fun",
    "house",
    "page",
    "term",
    "test",
    "answer",
    "sound",
    "focus",
    "matter",
    "kind",
    "soil",
    "board",
    "oil",
    "picture",
    "access",
    "garden",
    "range",
    "rate",
    "reason",
    "future",
    "site",
    "demand",
    "exercise",
    "image",
    "case",
    "cause",
    "coast",
    "action",
    "age",
    "bad",
    "boat",
    "record",
    "result",
    "section",
    "building",
    "mouse",
    "cash",
    "class",
    "period",
    "plan",
    "store",
    "tax",
    "side",
    "subject",
    "space",
    "rule",
    "stock",
    "weather",
    "chance",
    "figure",
    "man",
    "model",
    "source",
    "beginning",
    "earth",
    "program",
    "chicken",
    "design",
    "feature",
    "head",
    "material",
    "purpose",
    "question",
    "rock",
    "salt",
    "act",
    "birth",
    "car",
    "dog",
    "object",
    "scale",
    "sun",
    "note",
    "profit",
    "rent",
    "speed",
    "style",
    "war",
    "bank",
    "craft",
    "half",
    "inside",
    "outside",
    "standard",
    "bus",
    "exchange",
    "eye",
    "fire",
    "position",
    "pressure",
    "stress",
    "advantage",
    "benefit",
    "box",
    "frame",
    "issue",
    "step",
    "cycle",
    "face",
    "item",
    "metal",
    "paint",
    "review",
    "room",
    "screen",
    "structure",
    "view",
    "account",
    "ball",
    "discipline",
    "medium",
    "share",
    "balance",
    "bit",
    "black",
    "bottom",
    "choice",
    "gift",
    "impact",
    "machine",
    "shape",
    "tool",
    "wind",
    "address",
    "average",
    "career",
    "culture",
    "morning",
    "pot",
    "sign",
    "table",
    "task",
    "condition",
    "contact",
    "credit",
    "egg",
    "hope",
    "ice",
    "network",
    "north",
    "square",
    "attempt",
    "date",
    "effect",
    "link",
    "post",
    "star",
    "voice",
    "capital",
    "challenge",
    "friend",
    "self",
    "shot",
    "brush",
    "couple",
    "exit",
    "front",
    "function",
    "lack",
    "living",
    "plant",
    "plastic",
    "spot",
    "summer",
    "taste",
    "theme",
    "track",
    "wing",
    "brain",
    "button",
    "click",
    "desire",
    "foot",
    "gas",
    "influence",
    "notice",
    "rain",
    "wall",
    "base",
    "damage",
    "distance",
    "feeling",
    "pair",
    "savings",
    "staff",
    "sugar",
    "target",
    "text",
    "animal",
    "author",
    "budget",
    "discount",
    "file",
    "ground",
    "lesson",
    "minute",
    "officer",
    "phase",
    "reference",
    "register",
    "sky",
    "stage",
    "stick",
    "title",
    "trouble",
    "bowl",
    "bridge",
    "campaign",
    "character",
    "club",
    "edge",
    "evidence",
    "fan",
    "letter",
    "lock",
    "maximum",
    "novel",
    "option",
    "pack",
    "park",
    "quarter",
    "skin",
    "sort",
    "weight",
    "baby",
    "background",
    "carry",
    "dish",
    "factor",
    "fruit",
    "glass",
    "joint",
    "master",
    "muscle",
    "red",
    "strength",
    "traffic",
    "trip",
    "vegetable",
    "appeal",
    "chart",
    "gear",
    "ideal",
    "kitchen",
    "land",
    "log",
    "mother",
    "net",
    "party",
    "principle",
    "relative",
    "sale",
    "season",
    "signal",
    "spirit",
    "street",
    "tree",
    "wave",
    "belt",
    "bench",
    "commission",
    "copy",
    "drop",
    "minimum",
    "path",
    "progress",
    "project",
    "sea",
    "south",
    "status",
    "stuff",
    "ticket",
    "tour",
    "angle",
    "blue",
    "breakfast",
    "confidence",
    "daughter",
    "degree",
    "doctor",
    "dot",
    "dream",
    "duty",
    "essay",
    "father",
    "fee",
    "finance",
    "hour",
    "juice",
    "luck",
    "milk",
    "mouth",
    "peace",
    "pipe",
    "stable",
    "storm",
    "substance",
    "team",
    "trick",
    "afternoon",
    "bat",
    "beach",
    "blank",
    "catch",
    "chain",
    "consideration",
    "cream",
    "crew",
    "detail",
    "gold",
    "interview",
    "kid",
    "mark",
    "mission",
    "pain",
    "pleasure",
    "score",
    "screw",
    "sex",
    "shop",
    "shower",
    "suit",
    "tone",
    "window",
    "agent",
    "band",
    "bath",
    "block",
    "bone",
    "calendar",
    "candidate",
    "cap",
    "coat",
    "contest",
    "corner",
    "court",
    "cup",
    "district",
    "door",
    "east",
    "finger",
    "garage",
    "guarantee",
    "hole",
    "hook",
    "implement",
    "layer",
    "lecture",
    "lie",
    "manner",
    "meeting",
    "nose",
    "parking",
    "partner",
    "profile",
    "rice",
    "routine",
    "schedule",
    "swimming",
    "telephone",
    "tip",
    "winter",
    "airline",
    "bag",
    "battle",
    "bed",
    "bill",
    "bother",
    "cake",
    "code",
    "curve",
    "designer",
    "dimension",
    "dress",
    "ease",
    "emergency",
    "evening",
    "extension",
    "farm",
    "fight",
    "gap",
    "grade",
    "holiday",
    "horror",
    "horse",
    "host",
    "husband",
    "loan",
    "mistake",
    "mountain",
    "nail",
    "noise",
    "occasion",
    "package",
    "patient",
    "pause",
    "phrase",
    "proof",
    "race",
    "relief",
    "sand",
    "sentence",
    "shoulder",
    "smoke",
    "stomach",
    "string",
    "tourist",
    "towel",
    "vacation",
    "west",
    "wheel",
    "wine",
    "arm",
    "aside",
    "associate",
    "bet",
    "blow",
    "border",
    "branch",
    "breast",
    "brother",
    "buddy",
    "bunch",
    "chip",
    "coach",
    "cross",
    "document",
    "draft",
    "dust",
    "expert",
    "floor",
    "god",
    "golf",
    "habit",
    "iron",
    "judge",
    "knife",
    "landscape",
    "league",
    "mail",
    "mess",
    "native",
    "opening",
    "parent",
    "pattern",
    "pin",
    "pool",
    "pound",
    "request",
    "salary",
    "shame",
    "shelter",
    "shoe",
    "silver",
    "tackle",
    "tank",
    "trust",
    "assist",
    "bake",
    "bar",
    "bell",
    "bike",
    "blame",
    "boy",
    "brick",
    "chair",
    "closet",
    "clue",
    "collar",
    "comment",
    "conference",
    "devil",
    "diet",
    "fear",
    "fuel",
    "glove",
    "jacket",
    "lunch",
    "monitor",
    "mortgage",
    "nurse",
    "pace",
    "panic",
    "peak",
    "plane",
    "reward",
    "row",
    "sandwich",
    "shock",
    "spite",
    "spray",
    "surprise",
    "till",
    "transition",
    "weekend",
    "welcome",
    "yard",
    "alarm",
    "bend",
    "bicycle",
    "bite",
    "blind",
    "bottle",
    "cable",
    "candle",
    "clerk",
    "cloud",
    "concert",
    "counter",
    "flower",
    "grandfather",
    "harm",
    "knee",
    "lawyer",
    "leather",
    "load",
    "mirror",
    "neck",
    "pension",
    "plate",
    "purple",
    "ruin",
    "ship",
    "skirt",
    "slice",
    "snow",
    "specialist",
    "stroke",
    "switch",
    "trash",
    "tune",
    "zone",
    "anger",
    "award",
    "bid",
    "bitter",
    "boot",
    "bug",
    "camp",
    "candy",
    "carpet",
    "cat",
    "champion",
    "channel",
    "clock",
    "comfort",
    "cow",
    "crack",
    "engineer",
    "entrance",
    "fault",
    "grass",
    "guy",
    "hell",
    "highlight",
    "incident",
    "island",
    "joke",
    "jury",
    "leg",
    "lip",
    "mate",
    "motor",
    "nerve",
    "passage",
    "pen",
    "pride",
    "priest",
    "prize",
    "promise",
    "resident",
    "resort",
    "ring",
    "roof",
    "rope",
    "sail",
    "scheme",
    "script",
    "sock",
    "station",
    "toe",
    "tower",
    "truck",
    "witness",
    "can",
    "will",
    "other",
    "use",
    "make",
    "good",
    "look",
    "help",
    "go",
    "great",
    "being",
    "still",
    "public",
    "read",
    "keep",
    "start",
    "give",
    "human",
    "local",
    "general",
    "specific",
    "long",
    "play",
    "feel",
    "high",
    "put",
    "common",
    "set",
    "change",
    "simple",
    "past",
    "big",
    "possible",
    "particular",
    "major",
    "personal",
    "current",
    "national",
    "cut",
    "natural",
    "physical",
    "show",
    "try",
    "check",
    "second",
    "call",
    "move",
    "pay",
    "let",
    "increase",
    "single",
    "individual",
    "turn",
    "ask",
    "buy",
    "guard",
    "hold",
    "main",
    "offer",
    "potential",
    "professional",
    "international",
    "travel",
    "cook",
    "alternative",
    "special",
    "working",
    "whole",
    "dance",
    "excuse",
    "cold",
    "commercial",
    "low",
    "purchase",
    "deal",
    "primary",
    "worth",
    "fall",
    "necessary",
    "positive",
    "produce",
    "search",
    "present",
    "spend",
    "talk",
    "creative",
    "tell",
    "cost",
    "drive",
    "green",
    "support",
    "glad",
    "remove",
    "return",
    "run",
    "complex",
    "due",
    "effective",
    "middle",
    "regular",
    "reserve",
    "independent",
    "leave",
    "original",
    "reach",
    "rest",
    "serve",
    "watch",
    "beautiful",
    "charge",
    "active",
    "break",
    "negative",
    "safe",
    "stay",
    "visit",
    "visual",
    "affect",
    "cover",
    "report",
    "rise",
    "walk",
    "white",
    "junior",
    "pick",
    "unique",
    "classic",
    "final",
    "lift",
    "mix",
    "private",
    "stop",
    "teach",
    "western",
    "concern",
    "familiar",
    "fly",
    "official",
    "broad",
    "comfortable",
    "gain",
    "rich",
    "save",
    "stand",
    "young",
    "heavy",
    "lead",
    "listen",
    "valuable",
    "worry",
    "handle",
    "leading",
    "meet",
    "release",
    "sell",
    "finish",
    "normal",
    "press",
    "ride",
    "secret",
    "spread",
    "spring",
    "tough",
    "wait",
    "brown",
    "deep",
    "display",
    "flow",
    "hit",
    "objective",
    "shoot",
    "touch",
    "cancel",
    "chemical",
    "cry",
    "dump",
    "extreme",
    "push",
    "conflict",
    "eat",
    "fill",
    "formal",
    "jump",
    "kick",
    "opposite",
    "pass",
    "pitch",
    "remote",
    "total",
    "treat",
    "vast",
    "abuse",
    "beat",
    "burn",
    "deposit",
    "print",
    "raise",
    "sleep",
    "somewhere",
    "advance",
    "consist",
    "dark",
    "double",
    "draw",
    "equal",
    "fix",
    "hire",
    "internal",
    "join",
    "kill",
    "sensitive",
    "tap",
    "win",
    "attack",
    "claim",
    "constant",
    "drag",
    "drink",
    "guess",
    "minor",
    "pull",
    "raw",
    "soft",
    "solid",
    "wear",
    "weird",
    "wonder",
    "annual",
    "count",
    "dead",
    "doubt",
    "feed",
    "forever",
    "impress",
    "repeat",
    "round",
    "sing",
    "slide",
    "strip",
    "wish",
    "combine",
    "command",
    "dig",
    "divide",
    "equivalent",
    "hang",
    "hunt",
    "initial",
    "march",
    "mention",
    "spiritual",
    "survey",
    "tie",
    "adult",
    "brief",
    "crazy",
    "escape",
    "gather",
    "hate",
    "prior",
    "repair",
    "rough",
    "sad",
    "scratch",
    "sick",
    "strike",
    "employ",
    "external",
    "hurt",
    "illegal",
    "laugh",
    "lay",
    "mobile",
    "nasty",
    "ordinary",
    "respond",
    "royal",
    "senior",
    "split",
    "strain",
    "struggle",
    "swim",
    "train",
    "upper",
    "wash",
    "yellow",
    "convert",
    "crash",
    "dependent",
    "fold",
    "funny",
    "grab",
    "hide",
    "miss",
    "permit",
    "quote",
    "recover",
    "resolve",
    "roll",
    "sink",
    "slip",
    "spare",
    "suspect",
    "sweet",
    "swing",
    "twist",
    "upstairs",
    "usual",
    "abroad",
    "brave",
    "calm",
    "concentrate",
    "estimate",
    "grand",
    "male",
    "mine",
    "prompt",
    "quiet",
    "refuse",
    "regret",
    "reveal",
    "rush",
    "shake",
    "shift",
    "shine",
    "steal",
    "suck",
    "surround",
    "bear",
    "brilliant",
    "dare",
    "dear",
    "delay",
    "drunk",
    "female",
    "hurry",
    "inevitable",
    "invite",
    "kiss",
    "neat",
    "pop",
    "punch",
    "quit",
    "reply",
    "representative",
    "resist",
    "rip",
    "rub",
    "silly",
    "smile",
    "spell",
    "stretch",
    "stupid",
    "tear",
    "temporary",
    "tomorrow",
    "wake",
    "wrap",
    "yesterday",
    "Thomas",
    "Tom",
    "Lieuwe",
  ];

  var name =
    capFirst(name1[getRandomInt(0, name1.length + 1)]) +
    " " +
    capFirst(name2[getRandomInt(0, name2.length + 1)]);
  return name;
}

function adjuster() {
  const now = new Date(); // current date and time
  const athensOffset = 0; // Athens timezone offset from UTC (use 2 if not Daylight Saving Time)

  const intervals = {
    Feeding: 0.5,
    Cleaning: 5,
    Exercise: 6,
    HealthCheck: 8,
    Happiness: 7,
    MentalHealth: 6,
    Experience: 5,
  };

  const eventTimestamps = {};

  for (const [event, hours] of Object.entries(intervals)) {
    const eventTime = addHours(now, hours);
    // Adjust for the Athens timezone manually
    const eventTimeInAthens = addHours(eventTime, athensOffset);
    // convert to timestamp in milliseconds since UNIX epoch
    eventTimestamps[event] = {
      timestamp: eventTime.getTime(),
      human_readable: format(eventTimeInAthens, "yyyy-MM-dd HH:mm:ssXXX"),
    };
  }

  console.table(eventTimestamps);
}

adjuster();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
