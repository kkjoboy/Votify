# Votify

------
README
------

This project (Votify) was developed by Josh Mielke, Ashlyn Opgrande and Nick Polsin for the 2017 University of Washington Information School Capstone night, which was held on the 31st of May. Full contact information can be found at the end of this file. 

This README file was written on May 30th, 2017.

----------------
List of Contents
----------------

This README file contains an overview of Votify, a description of the technology we used to build it, and our contact information.

-------------------
Project Description
-------------------

Votify aims to fill in the information gap between Washington state government and its voters. Specifically, we aimed to provide these voters an easy opportunity to view information on state legislature, communicate their viewpoints to their legislators, and track how their legislators’ voting records matched their thoughts and concerns on issues. Our application utilizes the legislative data from www.leg.wa.gov to display to users pertinent information regarding bills and the roll call voting record per legislation. Votify aims to provide a streamlined user interface focused on local issues that will more directly affect its users.

--------------------
Technology Decisions
--------------------

Our application is built fully in a modified MEAN stack, replacing MongoDB typically found in MEAN stacks for MySQL Aurora on Amazon RDS for redundancy and scalability purposes. We decided to use the MEAN stack for our project because these Javascript libraries are becoming a new industry standard, the ExpressJS module for server side routing, the AngularJS module for client side routing, and the NodeJS module for server side hosting. AngularJS lets us take our large amounts of data from our databases and filter and display them on the client side with minimal repetition of HTML and CSS code, making our HTML codebase extremely clean and easy to manage. ExpressJS takes the worry out of having to write complex server side routing and allows us to condense our routing into a few files, even with very complex pages, and it also let us write an API to query our database from client-side AngularJS requests. The database is managed through Amazon RDS, which provides scalability and redundancy to our data stores. The build is deployed on Amazon Elastic Beanstalk, which lets us deploy changes directly from our GitHub repository. Our data mining script is written in Python and deployed on AWS Lambda, which is serverless computing that allows us to only pay for computing power when our script is refreshing the newest data in the database. Overall, using the Amazon AWS services and MEAN stack has allowed us to write a lightweight, cost-effective program that can run on its own for the time to come.

-------------------
Contact Information
-------------------
Josh Mielke: joshuamielke@gmail.com
Ashlyn Opgrande: aopgrande@gmail.com
Nick Polsin: npolsin@uw.edu
