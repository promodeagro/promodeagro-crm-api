'use strict';

const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDb = require('../utils/dynamoDbClient');

module.exports.deleteContactById = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Extracting the id from pathParameters
  const id = event.pathParameters && event.pathParameters.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing ID parameter' }),
    };
  }

  const tableName = 'Contacts';
  console.log('Table name:', tableName);

  const params = {
    TableName: tableName,
    Key: {
      id: id, // Directly passing the id as a string
    },
  };

  console.log('Delete params:', JSON.stringify(params, null, 2));

  try {
    await dynamoDb.send(new DeleteCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Contact with ID ${id} deleted successfully` }),
    };
  } catch (error) {
    console.log('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
