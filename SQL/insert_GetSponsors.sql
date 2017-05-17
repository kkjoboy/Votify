CREATE DEFINER=`capstone`@`%` PROCEDURE `insert_GetSponsors`(
		Id INT
        ,Name VARCHAR(45)
        ,LongName VARCHAR(45)
        ,Agency VARCHAR(45)
        ,Acronym VARCHAR(45)
        ,Party VARCHAR(45)
        ,District VARCHAR(45)
        ,Phone VARCHAR(45)
        ,Email VARCHAR(45)
        ,FirstName VARCHAR(45)
        ,LastName VARCHAR(45)
    )
BEGIN
	IF NOT EXISTS
		(
			SELECT idSponsor
            FROM Sponsor S
            WHERE S.Name = Name AND
				S.LongName = Name AND
                S.Agency = Agency AND
                S.Party = Party
		) THEN
		INSERT INTO
			Sponsor
				(
					ID
					,Name
					,LongName
					,Agency
					,Acronym
					,Party
					,District
					,Phone
					,Email
					,FirstName
					,LastName
				)
            VALUES
				(
					ID
					,Name
					,LongName
					,Agency
					,Acronym
					,Party
					,District
					,Phone
					,Email
					,FirstName
					,LastName
                );
	END IF;
END