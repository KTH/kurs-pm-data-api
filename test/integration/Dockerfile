FROM kthse/kth-nodejs:14.0.0

COPY ["check-_paths.js", "check-_paths.js"]
COPY ["check-_paths.json", "check-_paths.json"]

CMD ["node", "check-_paths.js", "http://api:3000/api/kurs-pm-data"]