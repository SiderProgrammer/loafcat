/**
 * @swagger
 * /api/process-deposits:
 *   post:
 *     tags:
 *       - Deposits-and-Purchases
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

/**
 * @swagger
 * /api/user-items/:
 *   post:
 *     tags:
 *       - Game-Items
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

/**
 * @swagger
 * /api/buy-item:
 *   post:
 *     tags:
 *       - Deposits-and-Purchases
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

/**
 * @swagger
 * /api/daily-purchases:
 *   post:
 *     tags:
 *       - Deposits-and-Purchases
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

/**
 * @swagger
 * /api/total-purchases:
 *   post:
 *     tags:
 *       - Deposits-and-Purchases
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

/**
 * @swagger
 * /api/feed-pet:
 *   post:
 *     tags:
 *       - Pet-Actions
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

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Initials
 *     summary: Create a new user record
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
 *                 description: The ID of the user.
 *                 example: "user123"
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: "john_doe"
 *               RegistrationDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date of user registration (ISO format).
 *                 example: "2024-02-12T12:00:00Z"
 *               LastActiveDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date of user's last activity (ISO format).
 *                 example: "2024-02-12T12:00:00Z"
 *     responses:
 *       '201':
 *         description: User and player data created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User and player data created successfully."
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error: Invalid username, Invalid registration date."
 *       '409':
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already exists."
 *       '500':
 *         description: An error occurred while creating the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating the user. Please try again later."
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 stack:
 *                   type: string
 *                   example: "Error: Internal server error at createUser (app.js:40)"
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *       - Initials
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
 * @swagger
 * /api/start-game:
 *   post:
 *     tags:
 *       - Start-End-Game
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
 * @swagger
 * /api/end-game:
 *   post:
 *     tags:
 *       - Start-End-Game
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
 * @swagger
 * /api/daily-spent:
 *   post:
 *     tags:
 *       - Deposits-and-Purchases
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

/**
 * @swagger
 * /api/update-total-care-activities:
 *   post:
 *     tags:
 *       - Pet-Actions
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

/**
 * @swagger
 * /api/update-total-care-special-activities:
 *   post:
 *     tags:
 *       - Pet-Actions
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

/**
 * @swagger
 * /api/link-pet:
 *   post:
 *     tags:
 *       - Initials
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
 *               PetName:
 *                 type: string
 *                 description: Any Name String.
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

/**
 * @swagger
 * /api/clean-wc:
 *   post:
 *     tags:
 *       - Pet-Actions
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

/**
 * @swagger
 * /api/update-wc:
 *   post:
 *     tags:
 *       - Pet-Actions
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

/**
 * @swagger
 * /api/get-game-items:
 *   post:
 *     tags:
 *       - Game-Items
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

/**
 * @swagger
 * /api/my-pet:
 *   post:
 *     tags:
 *       - Pet
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

/**
 * @swagger
 * /api/my-pets:
 *   post:
 *     tags:
 *       - Pet
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

/**
 * @swagger
 * /api/events-times:
 *   post:
 *     tags:
 *       - Pet-Actions
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

/**
 * @swagger
 * /api/daily-items:
 *   post:
 *     tags:
 *       - Game-Items
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

/**
 * @swagger
 * /api/refresh-items:
 *   post:
 *     tags:
 *       - Game-Items
 *     summary: Refresh daily items for a user
 *     description: Refresh the daily items for a specific user by deducting 20 credits and replacing their current items with 10 new random items from the game items.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 description: The unique identifier of the user.
 *             example:
 *               UserID: "user123"
 *     responses:
 *       200:
 *         description: Items refreshed successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Items refreshed successfully for user user123
 *       400:
 *         description: Not enough credits to refresh items.
 *         content:
 *           application/json:
 *             example:
 *               message: Not enough credits to refresh items. You need to deposit.
 *       404:
 *         description: No daily items found for the provided UserID.
 *         content:
 *           application/json:
 *             example:
 *               message: No daily items found for the provided UserID.
 *       500:
 *         description: Failed to refresh items for user due to an error.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to refresh items for user.
 */

/**
 * @swagger
 * /api/initialize-daily-items:
 *   post:
 *     tags:
 *       - Game-Items
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
