twitter-trends
==============

Getting started
--------------
You need nodejs 0.8.x.
````
git clone git://github.com/dfilatov/twitter-trends.git
cd twitter-trends
npm install -d
make bem-server
// in another console window in twitter-trends directory
make app
````

Then point your browser to:
  * http://127.0.0.1:3000/ -- view result (bemjson + bemhtml)
  * http://127.0.0.1:3000/?mode=bemjson -- view bemjson (json + priv)
  * http://127.0.0.1:3000/?mode=bemjson -- view data json