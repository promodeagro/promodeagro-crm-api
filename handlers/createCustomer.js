'use strict';

const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDb = require('../utils/dynamoDbClient');

// Function to generate a 4-digit ID
function generate4DigitId() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

module.exports.createCustomer = async (event) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'Contacts',
    Item: {
      id: generate4DigitId(),
      country: data.country || '',
      address: data.address || '',
      gender: data.gender || '',
      city: data.city || '',
      organization: data.organization || '',
      mobile_no: data.mobile_no || '',
      last_name: data.last_name || '',
      first_name: data.first_name || '',
      email: data.email || '',
      status: data.status || '',
      assigned_to: data.assigned_to || ''
    }
  };

  try {
    await dynamoDb.send(new PutCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Customer created successfully', id: params.Item.id })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};
