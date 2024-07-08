'use strict';

const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDb = require('../utils/dynamoDbClient');

module.exports.updateCustomer = async (event) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'Contacts',
    Key: {
      id: data.id
    },
    UpdateExpression: 'set #country = :country, #address = :address, #gender = :gender, #city = :city, #organization = :organization, #mobile_no = :mobile_no, #last_name = :last_name, #first_name = :first_name, #email = :email, #status = :status, #assigned_to = :assigned_to',
    ExpressionAttributeNames: {
      '#country': 'country',
      '#address': 'address',
      '#gender': 'gender',
      '#city': 'city',
      '#organization': 'organization',
      '#mobile_no': 'mobile_no',
      '#last_name': 'last_name',
      '#first_name': 'first_name',
      '#email': 'email',
      '#status': 'status',
      '#assigned_to': 'assigned_to'
    },
    ExpressionAttributeValues: {
      ':country': data.country || '',
      ':address': data.address || '',
      ':gender': data.gender || '',
      ':city': data.city || '',
      ':organization': data.organization || '',
      ':mobile_no': data.mobile_no || '',
      ':last_name': data.last_name || '',
      ':first_name': data.first_name || '',
      ':email': data.email || '',
      ':status': data.status || '',
      ':assigned_to': data.assigned_to || ''
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    const result = await dynamoDb.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};
