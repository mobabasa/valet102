const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event) => {
    try {
        // Extract vehicle ID from API Gateway path parameter
        const { id } = event.pathParameters;

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Vehicle ID is required' })
            };
        }

        // Fetch vehicle from DynamoDB
        const getParams = {
            TableName: 'Vehicles',
            Key: { id }
        };
        const result = await dynamoDb.get(getParams).promise();
        
        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Vehicle not found' })
            };
        }

        // Update vehicle status to "Requested"
        const updateParams = {
            TableName: 'Vehicles',
            Key: { id },
            UpdateExpression: 'SET #status = :status',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: { ':status': 'Requested' },
            ReturnValues: 'ALL_NEW'
        };

        const updatedVehicle = await dynamoDb.update(updateParams).promise();

        // Notify valet via SNS
        await sns.publish({
            Message: `Vehicle requested: ${result.Item.guestName} (Room ${result.Item.roomNumber}).`,
            PhoneNumber: "+13135905446" // Replace with valet team number or SNS topic
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(updatedVehicle.Attributes)
        };
    } catch (error) {
        console.error('Error requesting car:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
