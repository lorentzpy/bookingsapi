const { disconnectDb } = require("./connect.js");

const shutdown = async (server, signal) => {
    console.log(`Signal ${signal} received. Closing...`);

    try {
        console.log("Attempting to disconnect MongoDB...");
        await disconnectDb();
        console.log("MongoDB disconnected successfully");
    } catch (err) {
        console.error("Error during MongoDB disconnection:", err);
    }

    console.log("trying to close the server");
    if (server) {
        console.log("serveur par encore coupé");
        server.close(() => {            
            setTimeout( () => {
                process.exit(0);
            }, 3000);
            console.log("Server stopped successfully");
        })
    } else {
        process.exit(0);
    }
    
}

module.exports = shutdown;