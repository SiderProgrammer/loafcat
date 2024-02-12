require("dotenv").config();

const cron = require('node-cron');
const axios = require("axios");

const accessToken = process.env.JWT_SECRET;
const baseApiDomain = process.env.API_BASE_URL;

// Define the shuffle function Fisher-Yates (also known as Knuth) shuffle.perfectly random shuffle of an array.
function shuffleArray(array) {
  let shuffled = array.slice(); // Create a copy of the array
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


/// Schedule the cron job for testing with different timings
// For every 30 seconds use '*/30 * * * * *'
// For every minute use '*/1 * * * *'
// For every 5 minutes use '*/5 * * * *'
// For every 30 minutes use '*/30 * * * *'
const cronJob = cron.schedule('*/7 * * * *', async () => {
//cron.schedule('0 0 * * *', async () => { // This runs every day at midnight
try {
  console.log('Cron job started');

  // Fetch all users
  const usersResponse = await axios.get(`${baseApiDomain}items/users_data`, {
      headers: { Authorization: `Bearer ${accessToken}` }
  });
  const users = usersResponse.data.data;

  // Fetch all game items
  const allItemsResponse = await axios.get(`${baseApiDomain}items/game_items`, {
      headers: { Authorization: `Bearer ${accessToken}` }
  });
  const allItems = allItemsResponse.data.data;

  for (const user of users) {
      // Fetch user's daily items
      const userItemsResponse = await axios.get(`${baseApiDomain}items/user_items_daily`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { filter: { UserID: { _eq: user.UserID } } }
      });
      const userItems = userItemsResponse.data.data;
      
      
      // Create a set of purchased item IDs
      const purchasedItemIds = new Set(userItems.filter(item => item.is_purchased).map(item => item.ItemID));

      // Fetch all game items and filter out purchased items
      const allItemsResponse = await axios.get(`${baseApiDomain}items/game_items`, {
        headers: { Authorization: `Bearer ${accessToken}` ,
        params: {
          limit: 4000, // Adjust the limit as needed
        }}
      });
      const allItems = allItemsResponse.data.data.filter(item => !purchasedItemIds.has(item.id));


      // Check if it's time to refresh items
      const now = new Date();
      // uncomment for real case
      // const twelveHoursAgo = new Date(now.getTime() - (12 * 60 * 60 * 1000)); // 12 hours in milliseconds
      // const needRefresh = !userItems.length || new Date(userItems[0]?.Date).getTime() < twelveHoursAgo.getTime();
      
      //for testing
      const fiveMinutesAgo = new Date(now.getTime() - (5 * 60 * 1000)); // 5 minutes in milliseconds
      const needRefresh = !userItems.length || new Date(userItems[0]?.Date).getTime() < fiveMinutesAgo.getTime();


      
      //const needRefresh= true;
      if (needRefresh) {
          // Delete old items in a batch
         
          for (const item of userItems) {
            console.log(`Deleting Old Items- ${item.id} `);
            await axios.delete(`${baseApiDomain}items/user_items_daily/${item.id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        }
      
          // Shuffle and pick 10 random items
          const randomItems = shuffleArray(allItems).slice(0, 10);
          console.log(randomItems, "Random Items");
          for (const item of randomItems) {
            console.log(`Adding New ITem ${item.id}`);
            await axios.post(`${baseApiDomain}items/user_items_daily`, {
                UserID: user.UserID,
                ItemID: item.id,
                Date: Math.floor(now.getTime()),
                IsPurchased: false
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        }
         
      }
  }
  console.log('Cron job finished');
  cronJob.stop();
} catch (error) {
  console.error("Error running daily item refresh cron job:", error);
}
});


// Or to stop it manually from somewhere else in your code
function stopCronJob() {
  cronJob.stop();
}