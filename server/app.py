from flask import Flask
from flask_restplus import Api, Resource, abort

app = Flask(__name__)
api = Api(app)

words = ['foo', 'bar', 'baz']

@api.route('/api')
class Words(Resource):
    def get(self):
        return words

    def post(self):
        if api.payload is None or api.payload in words:
            return False
        words.append(api.payload)
        return True

@api.route('/api/<int:index>')
class Word(Resource):
    def get(self, index):
        if index <= 0 or index >= len(words):
            abort(404, message='Index out of range.')
        return words[index - 1]

    def delete(self, index):
        if index <= 0 or index >= len(words):
            abort(404, message='Index out of range.')
        del words[index - 1]

    def put(self, index):
        if index <= 0 or index >= len(words):
            abort(404, message='Index out of range.')
        
        words[index - 1] = api.payload

if __name__ == '__main__':
    app.run()