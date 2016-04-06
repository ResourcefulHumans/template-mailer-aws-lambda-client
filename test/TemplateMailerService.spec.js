'use strict';

var expect = require('chai').expect,
    http = require('http');

describe('TemplateMailerService', function () {
    var TemplateMailerService = require('../index');

    describe('template()', function () {
        var server;

        after(function (done) {
            server.close(done);
        });

        it('should register a template', function (done) {
            server = http.createServer(function (req, res) {
                expect(req.method).to.equal('PUT');
                expect(req.url).to.equal('/api/templates/templateid');
                expect(req.headers['content-type']).to.equal('application/vnd.resourceful-humans.template-mailer-aws-lambda.v1+json; charset=utf-8');
                req.on('data', function (data) {
                    var body = JSON.parse(data);
                    expect(body.subject).to.equal('subject');
                    expect(body.html).to.equal('<html>');
                    done();
                });
                res.writeHead(204);
                res.end();
            });

            server.listen(61234);

            var t = new TemplateMailerService('http://127.0.0.1:61234/api/');
            t.template('templateid', 'subject', '<html>');
        });
    });

    describe('config()', function () {
        var server;

        after(function (done) {
            server.close(done);
        });

        it('should register a smtp server configuration', function (done) {
            server = http.createServer(function (req, res) {
                expect(req.method).to.equal('PUT');
                expect(req.url).to.equal('/api/smtp_credentials/smtpid');
                expect(req.headers['content-type']).to.equal('application/vnd.resourceful-humans.template-mailer-aws-lambda.v1+json; charset=utf-8');
                req.on('data', function (data) {
                    var body = JSON.parse(data);
                    expect(body.dsn).to.equal('somedsn');
                    expect(body.email).to.equal('john.doe@example.com');
                    expect(body.name).to.equal('somename');
                    done();
                });
                res.writeHead(204);
                res.end();
            });

            server.listen(61234);

            var t = new TemplateMailerService('http://127.0.0.1:61234/api/');
            t.config('smtpid', 'somedsn', 'john.doe@example.com', 'somename');
        });
    });

    describe('send()', function () {
        var server;

        after(function (done) {
            server.close(done);
        });

        it('should send an email', function (done) {
            server = http.createServer(function (req, res) {
                expect(req.method).to.equal('POST');
                expect(req.url).to.equal('/api/send/smtpid/templateid');
                expect(req.headers['content-type']).to.equal('application/vnd.resourceful-humans.template-mailer-aws-lambda.v1+json; charset=utf-8');
                req.on('data', function (data) {
                    var body = JSON.parse(data);
                    expect(body.to).to.equal('john.doe@example.com');
                    expect(body.name).to.equal('somename');
                    expect(body.foo).to.equal('bar');
                    done();
                });
                res.writeHead(204);
                res.end();
            });

            server.listen(61234);

            var t = new TemplateMailerService('http://127.0.0.1:61234/api/');
            t.send('smtpid', 'templateid', 'john.doe@example.com', 'somename', {foo: 'bar'});
        });
    });
});
