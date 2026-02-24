const cron = require("node-cron");
const ConnectionsRequests = require("../models/connectionRequests");
const { run } = require("./sendEmail");
const { startOfDay, endOfDay, subDays } = require("date-fns");

const sleep = () => new Promise((resolve) => setTimeout(resolve,[3000]))

cron.schedule("2 15 * * *", async () => {
  try {
    const yesterday = subDays(Date.now(), 1);
    const startOfYesterday = startOfDay(yesterday);
    const endOfYesterday = endOfDay(yesterday);

    //yesterday's connection reqs
    const users = await ConnectionsRequests.aggregate([
      {
        $match: {
          status: "interested",
          createdAt: {
            $gt: startOfYesterday,
            $lt: endOfYesterday,
          },
        },
      },
      {
        $group: {
          _id: "$ToUserId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          email: "$user.emailId",
          count: 1,
        },
      },
    ]);

    console.log(users);


    // email sent still not optimized, how to handle 1000 emails at one time.
    for (const user of users) {
      try {
        console.log(user.email);
        const res = await run(
          `CONNECTION REQ SENT TO ${user.email}`,
          "You Have New Connection Requests!"
        );
       
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

