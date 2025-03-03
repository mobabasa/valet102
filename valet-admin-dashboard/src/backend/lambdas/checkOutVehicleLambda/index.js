const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const { id } = event.pathParameters; // Ensure id is extracted from URL path

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Vehicle ID is required" }),
            };
        }

        // Define delete parameters
        const params = {
            TableName: "Vehicles",
            Key: { id },
        };

        await dynamoDb.delete(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Vehicle ${id} checked out successfully` }),
        };
    } catch (error) {
        console.error("Error checking out vehicle:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
