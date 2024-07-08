'use strict';

const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDb = require('../utils/dynamoDbClient');

module.exports.getContactById = async (event) => {
  const { id } = event.queryStringParameters;

  const params = {
    TableName: 'Contacts',
    Key: {
      id: id
    }
  };

  try {
    const result = await dynamoDb.send(new GetCommand(params));
    if (result.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item)
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Contact not found' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
