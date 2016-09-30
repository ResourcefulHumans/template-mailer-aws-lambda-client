'use strict'

let request = require('request-promise')
let _trimEnd = require('lodash/trimEnd')

function TemplateMailerService (api, apiKey) {
  this.api = _trimEnd(api, '/')
  this.apiKey = apiKey
}

TemplateMailerService.prototype.template = function (id, subject, html, text) {
  let self = this
  return request({
    method: 'PUT',
    uri: self.api + '/templates/' + id,
    headers: {
      'x-api-key': self.apiKey,
      'Content-Type': 'application/vnd.resourceful-humans.template-mailer-aws-lambda.v2+json; charset=utf-8'
    },
    body: {subject, html, text},
    json: true
  })
}

TemplateMailerService.prototype.config = function (id, email, name) {
  let self = this
  return request({
    method: 'PUT',
    uri: self.api + '/transport/' + id,
    headers: {
      'x-api-key': self.apiKey,
      'Content-Type': 'application/vnd.resourceful-humans.template-mailer-aws-lambda.v2+json; charset=utf-8'
    },
    body: {email, name},
    json: true
  })
}

TemplateMailerService.prototype.send = function (transport, template, to, name, data) {
  let self = this
  data = data || {}
  data.to = to
  data.name = name
  return request({
    method: 'POST',
    uri: self.api + '/send/' + transport + '/' + template,
    headers: {
      'x-api-key': self.apiKey,
      'Content-Type': 'application/vnd.resourceful-humans.template-mailer-aws-lambda.v2+json; charset=utf-8'
    },
    body: data,
    json: true
  })
}

module.exports = TemplateMailerService
