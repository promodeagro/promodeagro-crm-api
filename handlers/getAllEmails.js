'use strict';

const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDb = require('../utils/dynamoDbClient');

module.exports.getAllEmails = async () => {
  const params = {
    TableName: 'Contacts',
    ProjectionExpression: 'email'
  };

  try {
    const result = await dynamoDb.send(new ScanCommand(params));
    const emails = result.Items.map(item => item.email);
    const emailCount = emails.length;

    return {
      statusCode: 200,
      body: JSON.stringify({ emails, count: emailCount })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
