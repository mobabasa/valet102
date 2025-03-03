import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async () => {
    const params = {
        TableName: 'Vehicles', // Replace with your DynamoDB table name
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching vehicles' }),
        };
    }
};
