const express = require('express');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bikidiki108@gmail.com',
      pass: 'Bismillah@08'
    }
  });

var mailOptions = {
  from: 'bikidiki108@gmail.com',
  to: 'bikidiki108@gmail.com',
  subject: 'Account Activation Link',
  text: 'That was easy!'
};



module.exports = {mailOptions, transporter}