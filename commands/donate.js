const fs = require('fs');

const path = require('path');

module.exports = {

  name: 'donate',

  category: 'Economy',

  description: 'Donate money to another user.',

  author: 'Yan',

  version: '3.0.0',

  usage: '/donate | <UID> | <amount>',

  async execute(api, event, args, commands, prefix, admins, appState, sendMessage) {

    const { threadID, senderID } = event;

    const balanceFile = path.join(__dirname, '..', 'database', 'balance.json');

    try {

      // Validate input

      const input = args.join(' ').split('|').map(a => a.trim());

      if (input.length !== 3) {

        const usageMessage = `====『 𝗗𝗢𝗡𝗔𝗧𝗘  』====\n\n`;

        usageMessage += `  ╭─╮\n`;

        usageMessage += `  | 『 𝗜𝗡𝗙𝗢 』 Invalid format.\n`;

        usageMessage += `  | ✅ Usage: ${prefix}donate | <UID> | <amount>\n`;

        usageMessage += `  | 📜 Example: ${prefix}donate | 123456789 | 500\n`;

        usageMessage += `  ╰─────────────ꔪ\n\n`;

       

        usageMessage += `> 𝗙𝗼𝗿 𝗳𝘂𝗿𝘁𝗵𝗲𝗿 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝗰𝗲, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁: 𝗸𝗼𝗿𝗶𝘀𝗮𝘄𝗮𝘂𝗺𝘂𝘇𝗮𝗸𝗶@𝗴𝗺𝗮𝗶𝗹.𝗰𝗼𝗺`;

        sendMessage(api, { threadID, message: usageMessage });

        return;

      }

      const targetID = input[1];

      const amount = parseInt(input[2]);

      if (isNaN(amount) || amount <= 0) {

        const errorMessage = `====『 𝗗𝗢𝗡𝗔𝗧𝗘 』====\n\n`;

        errorMessage += `  ╭─╮\n`;

        errorMessage += `  | 『 𝗜𝗡𝗙𝗢 』 Please enter a valid positive amount.\n`;

        errorMessage += `  | ✅ Example: ${prefix}donate | 123456789 | 500\n`;

        errorMessage += `  ╰─────────────ꔪ\n\n`;

       

        errorMessage += `> 𝗙𝗼𝗿 𝗳𝘂�_r𝘁𝗵𝗲𝗿 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝗰𝗲, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁: 𝗸𝗼𝗿𝗶𝘀𝗮𝘄𝗮𝘂𝗺𝘂𝘇𝗮𝗸𝗶@𝗴𝗺𝗮𝗶𝗹.𝗰𝗼𝗺`;

        sendMessage(api, { threadID, message: errorMessage });

        return;

      }

      if (!targetID.match(/^\d+$/)) {

        const errorMessage = `====『 𝗗𝗢𝗡𝗔𝗧𝗘  』====\n\n`;

        errorMessage += `  ╭─╮\n`;

        errorMessage += `  | 『 𝗜𝗡𝗙𝗢 』 Please enter a valid user ID.\n`;

        errorMessage += `  | ✅ Example: ${prefix}donate | 123456789 | 500\n`;

        errorMessage += `  ╰─────────────ꔪ\n\n`;

    

        errorMessage += `> 𝗙𝗼𝗿 𝗳𝘂𝗿𝘁𝗵𝗲𝗿 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝗰𝗲, �_c𝗼𝗻𝘁𝗮𝗰𝘁: 𝗸𝗼𝗿𝗶𝘀𝗮𝘄𝗮𝘂𝗺𝘂𝘇𝗮𝗸𝗶@𝗴𝗺𝗮𝗶𝗹.𝗰𝗼𝗺`;

        sendMessage(api, { threadID, message: errorMessage });

        return;

      }

      if (targetID === senderID) {

        const errorMessage = `====『 𝗗𝗢𝗡𝗔𝗧𝗘  』====\n\n`;

        errorMessage += `  ╭─╮\n`;

        errorMessage += `  | 『 𝗜𝗡𝗙𝗢 』 You cannot donate to yourself!\n`;

        errorMessage += `  | ✅ Example: ${prefix}donate | 123456789 | 500\n`;

        errorMessage += `  ╰─────────────ꔪ\n\n`;

        

        errorMessage += `> 𝗙𝗼𝗿 𝗳𝘂𝗿𝘁𝗵𝗲𝗿 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝗰𝗲, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁: 𝗸𝗼𝗿𝗶𝘀𝗮𝘄𝗮𝘂𝗺𝘂𝘇𝗮𝗸𝗶@𝗴𝗺𝗮𝗶𝗹.𝗰𝗼𝗺`;

        sendMessage(api, { threadID, message: errorMessage });

        return;

      }

      // Load balance data

      if (!fs.existsSync(balanceFile)) {

        const errorMessage = `====『  D𝗢𝗡𝗔𝗧𝗘  』====\n\n`;

        errorMessage += `  ╭─╮\n`;

        errorMessage += `  | 『 𝗜𝗡𝗙𝗢 』 No balance data found!\n`;

        errorMessage += `  ╰─────────────ꔪ\n\n`;

       

        errorMessage += `> 𝗙𝗼𝗿 𝗳𝘂𝗿𝘁𝗵𝗲𝗿 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝗰𝗲, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁: 𝗸𝗼𝗿𝗶𝘀𝗮𝘄𝗮umuz𝗮𝗸𝗶@𝗴𝗺𝗮𝗶𝗹.𝗰𝗼𝗺`;

        sendMessage(api, { threadID, message: errorMessage });

        return;

      }

      let balanceData = JSON.parse(fs.readFileSync(balanceFile, 'utf8'));

      // Initialize sender data if not exists

      if (!balanceData[senderID]) {

        balanceData[senderID] = { balance: 1000, bank: 0 };

      }

      if (balanceData[senderID].balance < amount) {

        const errorMessage = `====『 𝗗𝗢𝗡𝗔𝗧𝗘  』====\n\n`;

        errorMessage += `  ╭─╮\n`;

        errorMessage += `  | 『 𝗜𝗡𝗙𝗢 』 You don't have enough money to donate!\n`;

        errorMessage += `  | 💰 Current Balance: ${balanceData[senderID].balance} coins\n`;

        errorMessage += `  ╰─────────────ꔪ\n\n`;

        errorMessage += `> 𝗙𝗼𝗿 𝗳𝘂�_r𝘁𝗵𝗲𝗿 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝗰𝗲, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁: 𝗸𝗼𝗿𝗶𝘀𝗮𝘄𝗮𝘂𝗺𝘂𝘇𝗮𝗸𝗶@𝗴𝗺𝗮𝗶𝗹.𝗰𝗼𝗺`;

        sendMessage(api, { threadID, message: errorMessage });

        return;

      }

      // Perform donation

      balanceData[senderID].balance -= amount;

      balanceData[targetID] = balanceData[targetID] || { balance: 0, bank: 0 };

      balanceData[targetID].balance += amount;

      // Save balance data

      fs.writeFileSync(balanceFile, JSON.stringify(balanceData, null, 2));

      // Send success message

      const successMessage = `====『 𝗗𝗢𝗡𝗔𝗧𝗘 』====\n\n`;

      successMessage += `  ╭─╮\n`;

      successMessage += `  | 『 𝗦𝗨𝗖𝗖𝗘𝗦𝗦 』 Donated 💰 ${amount} coins to UID: ${targetID}!\n`;

      successMessage += `  | 💸 Your New Balance: ${balanceData[senderID].balance} coins\n`;

      successMessage += `  ╰─────────────ꔪ\n\n`;

   

      successMessage += `> 𝗙𝗼𝗿 𝗳𝘂𝗿𝘁𝗵𝗲𝗿 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝗰𝗲, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁: 𝗸𝗼𝗿𝗶𝘀𝗮𝘄𝗮𝘂𝗺𝘂𝘇𝗮𝗸𝗶@𝗴𝗺𝗮𝗶𝗹.𝗰𝗼𝗺`;

      sendMessage(api, { threadID, message: successMessage });

    } catch (error) {

      console.error('❌ Error in donate command:', error);

      const errorMessage = `====『 𝗗𝗢𝗡𝗔𝗧𝗘 𝗘𝗥𝗥𝗢𝗥 』====\n\n`;

      errorMessage += `  ╭─╮\n`;

      errorMessage += `  | 『 𝗜𝗡𝗙𝗢 』 An error occurred while processing your donation.\n`;

      errorMessage += `  ╰─────────────ꔪ\n\n`;

   

      errorMessage += `> 𝗙𝗼𝗿 𝗳𝘂𝗿𝘁𝗵𝗲𝗿 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝗰𝗲, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁: 𝗸𝗼𝗿𝗶𝘀𝗮𝘄𝗮𝘂𝗺𝘂𝘇𝗮𝗸𝗶@𝗴𝗺𝗮𝗶𝗹.𝗰𝗼𝗺`;

      sendMessage(api, { threadID, message: errorMessage });

    }

  },

};
