from zeep import Client
from datetime import datetime, timedelta
import mysql.connector
import sys
# from python_mysql_dbconfig import read_db_config

# ------------------------------------------------------------------------------------------------------------------------------
# GLOBALS
# Initial Timing Varables
# Includes current year and biennium (2017-18)
# ------------------------------------------------------------------------------------------------------------------------------

currentYear = datetime.now().year
lastWeek = datetime.now()-timedelta(days=7)
yesterday = datetime.now()-timedelta(days=1)
# yesterday = yesterday.strftime('%m/%d/%y')
today = datetime.now()
# today = today.strftime('%m/%d/%y')

# ------------------------------------------------------------------------------------------------------------------------------
# CONNECTION
# ------------------------------------------------------------------------------------------------------------------------------

# Connect allows us to connect to our Amazon RDS server
def connect():
    """ Connect to MySQL database """
    
    try:
        conn = mysql.connector.connect(host='capstone.c0dq76w6mhty.us-west-2.rds.amazonaws.com',
                                       database='legwagov',
                                       user='capstone',
                                       password='horsemonkeybatterydog')

        if conn.is_connected():
            print('Connected to MySQL database')
            
        return conn

    except:
        print("Unexpected error:", sys.exc_info()[0])
        raise

# ------------------------------------------------------------------------------------------------------------------------------
# GET METHODS FROM SOAP CLIENT (legwagov)
# ------------------------------------------------------------------------------------------------------------------------------

def getLegislationTypes():
    LegislationServiceClient = Client('http://wslwebservices.leg.wa.gov/legislationservice.asmx?WSDL')
    getLegislationTypesResult = LegislationServiceClient.service.GetLegislationTypes()

# Adds data into the Amendments table
def getAmendments(connection):
    print('Getting Amendments...')
    AmendmentServiceClient = Client('http://wslwebservices.leg.wa.gov/amendmentservice.asmx?WSDL')
    getAmendmentsResult = AmendmentServiceClient.service.GetAmendments(currentYear)
    for obj in getAmendmentsResult:
        args = (obj.Agency, obj.BillId, obj.BillNumber, obj.Description, obj.DocumentExists, obj.Drafter, obj.FloorAction, obj.FloorActionDate, obj.FloorNumber, obj.HtmUrl, obj.LegislativeSession, obj.Name, obj.PdfUrl, obj.SponsorName, obj.Type)
        call_procedure(connection, 'insert_Amendments', args)

# Adds data into the Committee, CommitteeMeetings, and CommitteeMeetings_Committees tables
def getCommitteeMeetings(connection):
    print('Getting Committee Meetings...')
    CommitteeMeetingServiceClient = Client('http://wslwebservices.leg.wa.gov/committeemeetingservice.asmx?WSDL')
    getCommitteeMeetingsResult = CommitteeMeetingServiceClient.service.GetCommitteeMeetings(lastWeek, today)

    for obj in getCommitteeMeetingsResult:
        # Get all committees and put them into string lists
        phoneList = ""
        acronymList = ""
        agencyList = ""
        idList = ""
        longnameList = ""
        nameList = ""
        committeeLength = 0
        for x,committee in enumerate(obj.Committees):
            delimeter = ","
            if x == 0:
                delimeter = ""
            phoneList = phoneList + delimeter + str(obj.Committees[committee][x].Phone)
            acronymList = acronymList + delimeter + str(obj.Committees[committee][x].Acronym)
            agencyList = agencyList + delimeter + str(obj.Committees[committee][x].Agency)
            idList = idList + delimeter + str(obj.Committees[committee][x].Id)
            longnameList = longnameList + delimeter + str(obj.Committees[committee][x].LongName)
            nameList = nameList + delimeter + str(obj.Committees[committee][x].Name)
            committeeLength = committeeLength + 1

        # Get committee meeting values
        args = (obj.Agency, obj.AgendaId, obj.Building, obj.Cancelled, obj.City, obj.ContactInformation, obj.Date, obj.RevisedDate, obj.Room, obj.State, obj.ZipCode, phoneList, acronymList, agencyList, idList, longnameList, nameList, committeeLength)
        # Submit this all to mysql stored procedure
        call_procedure(connection, 'insert_CommitteeMeetingService', args)

def getLegislationIntroducedSince(connection):
    print('Getting LegislationIntroducedSince...')
    LegislationServiceClient = Client('http://wslwebservices.leg.wa.gov/legislationservice.asmx?WSDL')
    getLegislationIntroducedSinceResult = LegislationServiceClient.service.GetLegislationIntroducedSince(lastWeek)

    for obj in getLegislationIntroducedSinceResult:
        LongLegislationType = None
        ShortLegislationType = None
        BillId = None
        HistoryLine = None
        ActionDate = None
        AmendedByOppositeBody = None
        PartialVeto = None
        Veto = None
        AmendmentsExist = None
        Status = None
        args = (obj.Biennium, obj.BillNumber, obj.SubstituteVersion, obj.EngrossedVersion, obj.OriginalAgency, obj.Active, obj.DisplayNumber, obj.StateFiscalNote, obj.LocalFiscalNote, obj.Appropriations, obj.RequestedByGovernor, obj.RequestedByBudgetCommittee, obj.RequestedByDepartment, obj.RequestedByOther, obj.ShortDescription, obj.Request, obj.IntroducedDate, obj.Sponsor, obj.PrimeSponsorID, obj.LongDescription, obj.LegalTitle, obj.ShortLegislationType.ShortLegislationType, obj.ShortLegislationType.LongLegislationType, obj.CurrentStatus.BillId, obj.CurrentStatus.HistoryLine, obj.CurrentStatus.ActionDate, obj.CurrentStatus.AmendedByOppositeBody, obj.CurrentStatus.PartialVeto, obj.CurrentStatus.Veto, obj.CurrentStatus.AmendmentsExist, obj.CurrentStatus.Status)
        call_procedure(connection, 'insert_GetLegislationIntroducedSince', args)

# ------------------------------------------------------------------------------------------------------------------------------
# TABLE INSERTS
# ------------------------------------------------------------------------------------------------------------------------------

# Takes in a connection, stored procedure as a string, and the arguments to run in the stored procedure and executes it on MySQL
def call_procedure(connection, storedProc, args):
    try:
        cursor = connection.cursor(buffered=True)
        cursor.callproc(storedProc, args)
        connection.commit()

    except Exception, e:
        print("Unexpected error:", sys.exc_info()[0])
        print(e)
        raise
 
    finally:
        cursor.close()

# ------------------------------------------------------------------------------------------------------------------------------
# MAIN
# ------------------------------------------------------------------------------------------------------------------------------

def main():
    connection = connect()
    # getAmendments(connection)
    # getCommitteeMeetings(connection)
    getLegislationIntroducedSince(connection)
    connection.close()
 
if __name__ == '__main__':
    main()