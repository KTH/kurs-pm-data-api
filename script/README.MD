# DB scripts

## findPublishedMemosWithouSyllabusValid

Requires the following .env variables:

```
BASE_URL=https://www-r.referens.sys.kth.se/kurs-pm/ # Example for ref
```

Run it with

```
node --env-file .env ./script/findPublishedMemosWithoutSyllabusValid.js
```

## updateMemosWithSyllabusData

```
node --env-file .env ./script/updateMemosWithSyllabusData.js
```

# Process:

1. Make DB Backup!!
2. CHECK WHICH ENV YOU'RE POINTING TO IN kurs-pm-data-api and studadm-om-kursen-packages/test-scripts
3. run findPublishedMemosWithouSyllabusValid
4. copy urls, paste them into the script in om-kursen-test/om-kursen-smoke-test and run STEP 1, make sure all goes well
5. copy the json-file, paste it into studadm-om-kursen-packages/test-scripts
6. run the script there to populate file with missing data
7. copy the json-file back here
8. run updateMemosWithSyllabusData with copied filename
9. run om-kursen-test/om-kursen-smoke-test STEP 2
