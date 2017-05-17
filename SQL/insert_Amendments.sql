CREATE DEFINER=`capstone`@`%` PROCEDURE `insert_Amendments`(
		Agency varchar(45)
        ,BillID int
        ,BillNumber int
        ,Description varchar(300)
        ,DocumentExists bool
        ,Drafter varchar(45)
        ,FloorAction varchar(45)
        ,FloorActionDate datetime
        ,FloorNumber int
        ,HtmUrl varchar(100)
        ,LegislativeSession varchar(45)
        ,Name varchar(100)
        ,PdfUrl varchar(100)
        ,SponsorName varchar(45)
        ,Type varchar(45)
    )
BEGIN
	IF NOT EXISTS
		(
			SELECT idAmendments
            FROM Amendements A 
            WHERE A.BillID = BillID AND
				A.BillNumber = BillNumber AND
                A.FloorActionDate = FloorActionDate AND
                A.Agency = Agency
		) THEN
		INSERT INTO
			Amendments
				(
					Agency
					,BillID
					,BillNumber
					,Description
					,DocumentExists
					,Drafter
					,FloorAction
					,FloorActionDate
					,FloorNumber
					,HtmUrl
					,LegislativeSession
					,Name
					,PdfUrl
					,SponsorName
					,Type
				)
            VALUES
				(
					Agency
                    ,BillID
                    ,BillNumber
                    ,Description
                    ,DocumentExists
                    ,Drafter
                    ,FloorAction
                    ,FloorActionDate
                    ,FloorNumber
                    ,HtmUrl
                    ,LegislativeSession
                    ,Name
                    ,PdfUrl
                    ,SponsorName
                    ,Type
                );
	END IF;
END