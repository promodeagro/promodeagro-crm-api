'use strict';

const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDb = require('../utils/dynamoDbClient');

module.exports.getNewCustomers = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const tableName = 'Contacts';
  console.log('Table name:', tableName);

  const params = {
    TableName: tableName,
    FilterExpression: '#status = :statusVal',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':statusVal': 'New',
    },
  };

  console.log('Scan params:', JSON.stringify(params, null, 2));

  try {
    const result = await dynamoDb.send(new ScanCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.log('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
