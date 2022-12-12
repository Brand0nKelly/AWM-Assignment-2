AWM-Assignment-2

Overview of the front-end:

Home Page:

User logins in using username and password credentials, a POST request is sent to database to verify if their legitimate as well checking the user token which got by REST Token authentication.


<img width="200" alt="Screenshot 2022-12-12 at 00 14 21" src="https://user-images.githubusercontent.com/71873543/206938033-375a6a86-4311-4e2e-a5b2-4175c5ce8dd2.png">

Map Page:

Displays Map of current user location then sends the user location to the back via A POST request and is recieved by the updated-location endpoint

<img width="200" alt="Screenshot 2022-12-12 at 00 15 00" src="https://user-images.githubusercontent.com/71873543/206939523-1e48ed19-67da-4cbf-834a-3ea2048e8d19.png"> 


Overpass Turbo:

Created using overpass turbo, still working on getting this implemented (1 error to fix)

<img width="713" alt="Screenshot 2022-12-12 at 05 34 53" src="https://user-images.githubusercontent.com/71873543/206968330-b25defb6-154d-4bdb-872a-d5eb2fc1d0c6.png">



Overview of the back-end:


REST API /Users/ :

<img width="1310" alt="Screenshot 2022-12-12 at 00 16 15" src="https://user-images.githubusercontent.com/71873543/206939676-3eaff3e5-a3ef-4a76-a8e7-451ded8e7eeb.png">


REST API /Swagger_UI/
<img width="1440" alt="Screenshot 2022-12-12 at 00 16 55" src="https://user-images.githubusercontent.com/71873543/206939695-0fe57070-e648-4a70-83c1-5736b8d297de.png">


REST API /Updated-location/
<img width="1438" alt="Screenshot 2022-12-12 at 00 51 49" src="https://user-images.githubusercontent.com/71873543/206939920-75f242b5-d83c-453d-abab-865169f60c36.png">


Deployment:



Website:
<img width="452" alt="image" src="https://user-images.githubusercontent.com/71873543/206968901-4be2503b-da4e-4393-a170-e7b19449653f.png">


Digital Ocean Droplet
<img width="1196" alt="Screenshot 2022-12-12 at 05 40 12" src="https://user-images.githubusercontent.com/71873543/206968978-2e486d5f-d6ca-48e2-a9bb-339a2a9b55b8.png">
