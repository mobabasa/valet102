const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const { id } = JSON.parse(event.body);

        if (!id) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing vehicle ID" }) };
        }

        const params = {
            TableName: 'Vehicles',
            Key: { id }
        };

        await dynamoDb.delete(params).promise();

        return { statusCode: 200, body: JSON.stringify({ message: "Vehicle checked out successfully" }) };
    } catch (error) {
        console.error("Error checking out vehicle:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
