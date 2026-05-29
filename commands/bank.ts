
import AuroraBetaStyler from '@aurora/styler';



module.exports = {
  config: {
    name: "bank",
    author: "Aljur Pogoy",
    description: "Manage your bank account!",
    usage: "/bank <action> [amount/name]",
    version: "3.0.0",
  },
  async run({ api, event, args, usersData }: { api: any; event: any; args: string[]; usersData: Map<string, ShadowBot.UserData> }) {
    const { threadID, messageID, senderID } = event;
    try {
      let user = usersData.get(senderID) || { balance: 0, bank: 0, account: null, loan: null };
      user.balance = user.balance || 0;
      user.bank = user.bank || 0;
      user.account = user.account || null;
      user.loan = user.loan || null;
      usersData.set(senderID, user);

      const action = args[0] ? args[0].toLowerCase() : null;
      if (!user.account && action !== "register") {
        const errorMessage = AuroraBetaStyler.styleOutput({
          headerText: 'Bank',
          headerSymbol: '🏦',
          headerStyle: 'bold',
          bodyText: '❌ You need to register first!\nUsage: /bank register <name>\nExample: /bank register Aljur Pogoy',
          bodyStyle: 'sansSerif, 
        });
        return api.sendMessage(errorMessage, threadID, messageID);
      }

      if (!action || !["register", "withdraw", "deposit", "loan", "repay"].includes(action)) {
        const menuMessage = AuroraBetaStyler.styleOutput({
          headerText: 'Bank Menu',
          headerSymbol: '════',
          headerStyle: 'bold',
          bodyText: '📝 Register - /bank register <name>\n💸 Withdraw - /bank withdraw <amount>\n💰 Deposit - /bank deposit <amount>\n🏦 Loan - /bank loan <amount>\n📜 Repay - /bank repay\n\n> Manage your coins with ease!',
          bodyStyle: 'sansSerif',
        });
        return api.sendMessage(menuMessage, threadID, messageID);
      }

      if (action === "register") {
        const name = args.slice(1).join(" ").trim();
        if (!name) {
          const errorMessage = AuroraBetaStyler.styleOutput({
            headerText: 'Register',
            headerSymbol: '📝',
            headerStyle: 'bold',
            bodyText: '❌ Please provide your name!\nUsage: /bank register <name>\nExample: /bank register Aljur Pogoy',
            bodyStyle: 'sansSerif',
          });
          return api.sendMessage(errorMessage, threadID, messageID);
        }
        if (user.account) {
          const errorMessage = AuroraBetaStyler.styleOutput({
            headerText: 'Register',
            headerSymbol: '📝',
            headerStyle: 'bold',
            bodyText: '❌ You are already registered as ' + user.account + '!',
            bodyStyle: 'sansSerif',
          });
          return api.sendMessage(errorMessage, threadID, messageID);
        }
        user.account = name;
        usersData.set(senderID, user);
        const successMessage = AuroraBetaStyler.styleOutput({
          headerText: 'Register',
          headerSymbol: '📝',
          headerStyle: 'bold',
          bodyText: '✅ Successfully registered as ' + name + '!\n🏦 You can now use withdraw, deposit, and loan features.',
          bodyStyle: 'sansSerif',
        });
        return api.sendMessage(successMessage, threadID, messageID);
      }

      const amount = parseInt(args[1]);
      if (["withdraw", "deposit", "loan"].includes(action) && (!args[1] || isNaN(amount) || amount <= 0)) {
        const errorMessage = AuroraBetaStyler.styleOutput({
          headerText: 'Bank',
          headerSymbol: '🏦',
          headerStyle: 'bold',
          bodyText: '❌ Please provide a valid amount!\nExample: /bank ' + action + ' 100',
          bodyStyle: 'ssansSerif', 
        });
        return api.sendMessage(errorMessage, threadID, messageID);
      }

      if (action === "withdraw") {
        if (user.bank < amount) {
          const errorMessage = AuroraBetaStyler.styleOutput({
            headerText: 'Withdraw',
            headerSymbol: '💸',
            headerStyle: 'bold',
            bodyText: '❌ Insufficient funds in your bank!\nBank Balance: ' + user.bank + ' coins\nRequired: ' + amount + ' coins',
            bodyStyle: 'sansSerif', 
          });
          return api.sendMessage(errorMessage, threadID, messageID);
        }
        user.bank -= amount;
        user.balance += amount;
        usersData.set(senderID, user);
        const successMessage = AuroraBetaStyler.styleOutput({
          headerText: 'Withdraw',
          headerSymbol: '💸',
          headerStyle: 'bold',
          bodyText: '✅ Successfully withdrew ' + amount + ' coins!\n🏦 Bank Balance: ' + user.bank + ' coins\n💰 Wallet Balance: ' + user.balance + ' coins',
          bodyStyle: 'sansSerif',
        });
        return api.sendMessage(successMessage, threadID, messageID);
      }

      if (action === "deposit") {
        if (user.balance < amount) {
          const errorMessage = AuroraBetaStyler.styleOutput({
            headerText: 'Deposit',
            headerSymbol: '💰',
            headerStyle: 'bold',
            bodyText: '❌ Insufficient funds in your wallet!\nWallet Balance: ' + user.balance + ' coins\nRequired: ' + amount + ' coins',
            bodyStyle: 'sansSerif', 
          });
          return api.sendMessage(errorMessage, threadID, messageID);
        }
        user.balance -= amount;
        user.bank += amount;
        usersData.set(senderID, user);
        const successMessage = AuroraBetaStyler.styleOutput({
          headerText: 'Deposit',
          headerSymbol: '💰',
          headerStyle: 'bold',
          bodyText: '✅ Successfully deposited ' + amount + ' coins!\n🏦 Bank Balance: ' + user.bank + ' coins\n💰 Wallet Balance: ' + user.balance + ' coins',
          bodyStyle: 'sansSerif', 
        });
        return api.sendMessage(successMessage, threadID, messageID);
      }

      if (action === "loan") {
        const maxLoan = 10000;
        const interestRate = 0.1;
        if (user.loan) {
          const totalRepay = user.loan.amount + user.loan.interest;
          const errorMessage = AuroraBetaStyler.styleOutput({
            headerText: 'Loan',
            headerSymbol: '🏦',
            headerStyle: 'bold',
            bodyText: '❌ You already have an outstanding loan!\nLoan Amount: ' + user.loan.amount + ' coins\nInterest: ' + user.loan.interest + ' coins\nTotal to Repay: ' + totalRepay + ' coins\n\nPlease repay your loan before taking a new one.',
            bodyStyle: 'sansSerif',
          });
          return api.sendMessage(errorMessage, threadID, messageID);
        }
        if (amount > maxLoan) {
          const errorMessage = AuroraBetaStyler.styleOutput({
            headerText: 'Loan',
            headerSymbol: '🏦',
            headerStyle: 'bold',
            bodyText: '❌ Loan amount cannot exceed ' + maxLoan + ' coins!',
            bodyStyle: 'sansSerif',
          });
          return api.sendMessage(errorMessage, threadID, messageID);
        }
        const interest = Math.floor(amount * interestRate);
        const totalRepay = amount + interest;
        user.balance += amount;
        user.loan = { amount, interest };
        usersData.set(senderID, user);
        const successMessage = AuroraBetaStyler.styleOutput({
          headerText: 'Loan',
          headerSymbol: '🏦',
          headerStyle: 'bold',
          bodyText: '✅ Successfully borrowed ' + amount + ' coins!\n💸 Interest (10%): ' + interest + ' coins\n📜 Total to Repay: ' + totalRepay + ' coins\n💰 Wallet Balance: ' + user.balance + ' coins\n\n⚠️ Repay your loan before taking a new one!',
          bodyStyle: 'sansSerif',
        });
        return api.sendMessage(successMessage, threadID, messageID);
      }

      if (action === "repay") {
        if (!user.loan) {
          const errorMessage = AuroraBetaStyler.styleOutput({
            headerText: 'Repay',
            headerSymbol: '🏦',
            headerStyle: 'bold',
            bodyText: '❌ You have no outstanding loan to repay!',
            bodyStyle: 'sansSerif',
          });
          return api.sendMessage(errorMessage, threadID, messageID);
        }
        const totalRepay = user.loan.amount + user.loan.interest;
        if (user.balance < totalRepay) {
          const errorMessage = AuroraBetaStyler.styleOutput({
            headerText: 'Repay',
            headerSymbol: '🏦',
            headerStyle: 'bold',
            bodyText: '❌ Insufficient funds in your wallet!\nWallet Balance: ' + user.balance + ' coins\nRequired to Repay: ' + totalRepay + ' coins',
            bodyStyle: 'sansSerif',
          });
          return api.sendMessage(errorMessage, threadID, messageID);
        }
        user.balance -= totalRepay;
        delete user.loan;
        usersData.set(senderID, user);
        const successMessage = AuroraBetaStyler.styleOutput({
          headerText: 'Repay',
          headerSymbol: '🏦',
          headerStyle: 'bold',
          bodyText: '✅ Successfully repaid your loan of ' + totalRepay + ' coins!\n💰 Wallet Balance: ' + user.balance + ' coins',
          bodyStyle: 'sansSerif', 
        });
        return api.sendMessage(successMessage, threadID, messageID);
      }
    } catch (error) {
      console.error("『 🌙 』 Error in bank command:", error);
      const errorMessage = AuroraBetaStyler.styleOutput({
        headerText: 'Bank',
        headerSymbol: '🏦',
        headerStyle: 'bold',
        bodyText: '❌ An error occurred while processing your bank action.',
        bodyStyle: 'sansSerif',
      });
      api.sendMessage(errorMessage, threadID, messageID);
    }
  },
};
