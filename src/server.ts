import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 3000;

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to db successfully");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log("An error occoured", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();