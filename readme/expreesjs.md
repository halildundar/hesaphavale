[req.protocol] ............. http
[req.hostname] .......... localhost
[req.headers.host] ..... localhost:8000
[req.route.path] .......... /profile/:id/:details
[req.baseUrl] .............. /api/users
[req.path] ................... /profile/123/summary
[req.url] ...................... /profile/123/summary?view=grid&leng=en
[req.originalUrl] .......... /api/users/profile/123/summary?view=grid&leng=en

req.protocol + '://' + req.get('host')