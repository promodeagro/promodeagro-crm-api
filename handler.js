'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLES = {
  CONTACTS: process.env.CONTACTS_TABLE,
  MAILS: process.env.MAILS_TABLE,
  TASKS: process.env.TASKS_TABLE,
  CUSTOMERS: process.env.CUSTOMERS_TABLE,
  REQUESTS: process.env.REQUESTS_TABLE,
};

module.exports.getContacts = async () => {
  const params = {
    TableName: TABLES.CONTACTS,
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch contacts' }),
    };
  }
};

module.exports.createContact = async (event) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: TABLES.CONTACTS,
    Item: {
      id: Date.now(),
      ...data,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ id: params.Item.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create contact' }),
    };
  }
};

module.exports.getContactById = async (event) => {
  const params = {
    TableName: TABLES.CONTACTS,
    Key: {
      id: parseInt(event.pathParameters.id),
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (result.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Contact not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch contact' }),
    };
  }
};

module.exports.updateContactById = async (event) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: TABLES.CONTACTS,
    Key: {
      id: parseInt(event.pathParameters.id),
    },
    UpdateExpression: 'set #name = :name, #organization = :organization, #status = :status, #address = :address, #email = :email, #mobile_number = :mobile_number, #assigned_to = :assigned_to',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#organization': 'organization',
      '#status': 'status',
      '#address': 'address',
      '#email': 'email',
      '#mobile_number': 'mobile_number',
      '#assigned_to': 'assigned_to',
    },
    ExpressionAttributeValues: {
      ':name': data.name,
      ':organization': data.organization,
      ':status': data.status,
      ':address': data.address,
      ':email': data.email,
      ':mobile_number': data.mobile_number,
      ':assigned_to': data.assigned_to,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update contact' }),
    };
  }
};

module.exports.deleteContactById = async (event) => {
  const params = {
    TableName: TABLES.CONTACTS,
    Key: {
      id: parseInt(event.pathParameters.id),
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 204,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete contact' }),
    };
  }
};

module.exports.getMails = async () => {
  const params = {
    TableName: TABLES.MAILS,
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch mails' }),
    };
  }
};

module.exports.getOngoingTasks = async () => {
  const params = {
    TableName: TABLES.TASKS,
    FilterExpression: '#status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': 'ongoing',
    },
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch ongoing tasks' }),
    };
  }
};

module.exports.getNewCustomers = async () => {
  const params = {
    TableName: TABLES.CUSTOMERS,
    FilterExpression: '#status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': 'new',
    },
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch new customers' }),
    };
  }
};

module.exports.getClosedRequests = async () => {
  const params = {
    TableName: TABLES.REQUESTS,
    FilterExpression: '#status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': 'closed',
    },
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch closed requests' }),
    };
  }
};
