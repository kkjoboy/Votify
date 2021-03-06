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

biennium = '2017-18'
currentYear = datetime.now().year
lastWeek = datetime.now()-timedelta(days=7)
yesterday = datetime.now()-timedelta(days=1)
firstOfTheYear = datetime.now().date().replace(month=1, day=1)
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

def getLegislationTypes(connection):
    LegislationServiceClient = Client('http://wslwebservices.leg.wa.gov/legislationservice.asmx?WSDL')
    getLegislationTypesResult = LegislationServiceClient.service.GetLegislationTypes()

# Adds data into the Amendments table
def getAmendments(connection):
    print('Getting Amendments...')
    AmendmentServiceClient = Client('http://wslwebservices.leg.wa.gov/amendmentservice.asmx?WSDL')
    getAmendmentsResult = AmendmentServiceClient.service.GetAmendments(currentYear)

    if (getAmendmentsResult == None):
        return

    for obj in getAmendmentsResult:
        print(obj)
        args = (obj.Agency, obj.BillId, obj.BillNumber, obj.Description, obj.DocumentExists, obj.Drafter, obj.FloorAction, obj.FloorActionDate, obj.FloorNumber, obj.HtmUrl, obj.LegislativeSession, obj.Name, obj.PdfUrl, obj.SponsorName, obj.Type)
        call_procedure(connection, 'insert_Amendments', args)

# Adds data into the Committee, CommitteeMeetings, and CommitteeMeetings_Committees tables
# DEFUNCT
def getCommitteeMeetings(connection):
    print('Getting Committee Meetings...')
    CommitteeMeetingServiceClient = Client('http://wslwebservices.leg.wa.gov/committeemeetingservice.asmx?WSDL')
    getCommitteeMeetingsResult = CommitteeMeetingServiceClient.service.GetCommitteeMeetings(firstOfTheYear, today)
    
    if (getCommitteeMeetingsResult == None):
        return

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

        print(obj)
        # Get committee meeting values
        args = (obj.Agency, obj.AgendaId, obj.Building, obj.Cancelled, obj.City, obj.ContactInformation, obj.Date, obj.RevisedDate, obj.Room, obj.State, obj.ZipCode, phoneList, acronymList, agencyList, idList, longnameList, nameList, committeeLength)
        # Submit this all to mysql stored procedure
        call_procedure(connection, 'insert_CommitteeMeetingService', args)

def getCommitteeMeetingItems(connection):
    print('Getting CommitteeMeetingItems...')
    CommitteeMeetingServiceClient = Client('http://wslwebservices.leg.wa.gov/committeemeetingservice.asmx?WSDL')

    query = "SELECT AgendaID FROM CommitteeMeetings"
    args = ()
    agendaInfo = select_query(connection, query, args)

    for committeeMeeting in agendaInfo:
        agendaID = committeeMeeting[0]
        getCommitteeMeetingItemsResult = CommitteeMeetingServiceClient.service.GetCommitteeMeetingItems(agendaID)
        if (getCommitteeMeetingItemsResult == None):
            continue
        for committeeMeetingItem in getCommitteeMeetingItemsResult:
            # print committeeMeetingItem.AgendaId
            # print committeeMeetingItem.HearingType
            # print committeeMeetingItem.HearingTypeDescription
            # print committeeMeetingItem.Order
            # print committeeMeetingItem.BillId
            # print committeeMeetingItem.ItemDescription
            # print committeeMeetingItem.Biennium
            print(committeeMeetingItem)
            args = (agendaID, committeeMeetingItem.HearingType, committeeMeetingItem.HearingTypeDescription, committeeMeetingItem.Order, committeeMeetingItem.BillId, committeeMeetingItem.ItemDescription, committeeMeetingItem.Biennium)
            call_procedure(connection, 'insert_CommitteeMeetingItems', args)

def getCommittees(connection):
    print('Getting Committees...')
    CommitteeServiceClient = Client('http://wslwebservices.leg.wa.gov/committeeservice.asmx?WSDL')
    getActiveCommitteesResult = CommitteeServiceClient.service.GetActiveCommittees()

    for committee in getActiveCommitteesResult:
        # print committee.Id
        # print committee.Name
        # print committee.LongName
        # print committee.Agency
        # print committee.Acronym
        # print committee.Phone
        print(committee)
        args = (committee.Id, committee.Name, committee.LongName, committee.Agency, committee.Acronym, committee.Phone, datetime.now())
        call_procedure(connection, 'insert_ActiveCommittees', args)

def getLegislativeDocuments(connection):
    print('Getting Legislative Documents...')
    LegislativeDocumentServiceClient = Client('http://wslwebservices.leg.wa.gov/legislativedocumentservice.asmx?WSDL')
    getDocumentClassesResult = LegislativeDocumentServiceClient.service.GetDocumentClasses(biennium)

    for documentClass in getDocumentClassesResult:
        getAllDocumentsByClassResult = LegislativeDocumentServiceClient.service.GetAllDocumentsByClass(biennium, documentClass)
        for obj in getAllDocumentsByClassResult:
            # print obj.Name
            # print obj.ShortFriendlyName
            # print obj.Biennium
            # print obj.LongFriendlyName
            # print obj.Description
            # print obj.Type
            # print obj.Class
            # print obj.HtmUrl
            # print obj.HtmCreateDate
            # print obj.HtmLastModifiedDate
            # print obj.PdfUrl
            # print obj.PdfCreateDate
            # print obj.PdfLastModifiedDate
            # print obj.BillId

            print(obj)
            args = (obj.Name, obj.ShortFriendlyName, obj.Biennium, obj.LongFriendlyName, obj.Description, obj.Type, obj.Class, obj.HtmUrl, obj.HtmCreateDate, obj.HtmLastModifiedDate, obj.PdfUrl, obj.PdfCreateDate, obj.PdfLastModifiedDate, obj.BillId)
            call_procedure(connection, 'insert_LegislativeDocuments', args)

    # for committee in getActiveCommitteesResult:
    #     # print committee.Id
    #     # print committee.Name
    #     # print committee.LongName
    #     # print committee.Agency
    #     # print committee.Acronym
    #     # print committee.Phone
    #     args = (committee.Id, committee.Name, committee.LongName, committee.Agency, committee.Acronym, committee.Phone, datetime.now())
    #     call_procedure(connection, 'insert_ActiveCommittees', args)

def getSponsorCommittees(connection):
    print('Getting Sponsor Committees...')
    CommitteeServiceClient = Client('http://wslwebservices.leg.wa.gov/committeeservice.asmx?WSDL')

    query = "SELECT idCommittee, Agency, Name FROM Committee"
    args = ()
    committeeInfo = select_query(connection, query, args)

    for committee in committeeInfo:
        idCommittee = committee[0]
        # print committee[0]
        # print committee[1]
        # print committee[2]
        if (committee[1] not in ["House", "Senate"]):
            continue
        getSponsorCommitteesResult = CommitteeServiceClient.service.GetCommitteeMembers(biennium, committee[1], committee[2])
        if (getSponsorCommitteesResult == None):
            continue
        for sponsor in getSponsorCommitteesResult:
            # print sponsor.Id
            # print sponsor.Name
            # print sponsor.LongName
            # print sponsor.Agency
            # print sponsor.Acronym
            # print sponsor.Party
            # print sponsor.District
            # print sponsor.Phone
            # print sponsor.Email
            # print sponsor.FirstName
            # print sponsor.LastName
            print(sponsor)
            args = (sponsor.Id, sponsor.Name, sponsor.LongName, sponsor.Agency, sponsor.Acronym, sponsor.Party, sponsor.District, sponsor.Phone, sponsor.Email, sponsor.FirstName, sponsor.LastName, committee[0])
            call_procedure(connection, 'insert_SponsorCommittee', args)


def getLegislationIntroducedSince(connection):
    print('Getting LegislationIntroducedSince...')
    LegislationServiceClient = Client('http://wslwebservices.leg.wa.gov/legislationservice.asmx?WSDL')
    getLegislationIntroducedSinceResult = LegislationServiceClient.service.GetLegislationIntroducedSince(firstOfTheYear)

    if (getLegislationIntroducedSinceResult == None):
        return

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
        print(obj)
        args = (obj.Biennium, obj.BillNumber, obj.SubstituteVersion, obj.EngrossedVersion, obj.OriginalAgency, obj.Active, obj.DisplayNumber, obj.StateFiscalNote, obj.LocalFiscalNote, obj.Appropriations, obj.RequestedByGovernor, obj.RequestedByBudgetCommittee, obj.RequestedByDepartment, obj.RequestedByOther, obj.ShortDescription, obj.Request, obj.IntroducedDate, obj.Sponsor, obj.PrimeSponsorID, obj.LongDescription, obj.LegalTitle, obj.ShortLegislationType.ShortLegislationType, obj.ShortLegislationType.LongLegislationType, obj.CurrentStatus.BillId, obj.CurrentStatus.HistoryLine, obj.CurrentStatus.ActionDate, obj.CurrentStatus.AmendedByOppositeBody, obj.CurrentStatus.PartialVeto, obj.CurrentStatus.Veto, obj.CurrentStatus.AmendmentsExist, obj.CurrentStatus.Status)
        call_procedure(connection, 'insert_GetLegislationIntroducedSince', args)

def getSponsors(connection):
    print('Getting Sponsors...')
    SponsorServiceClient = Client('http://wslwebservices.leg.wa.gov/sponsorservice.asmx?WSDL')
    getSponsorsResult = SponsorServiceClient.service.GetSponsors(biennium)

    if (getSponsorsResult == None):
        return

    for obj in getSponsorsResult:
        print(obj)
        args = (obj.Id, obj.Name, obj.LongName, obj.Agency, obj.Acronym, obj.Party, obj.District, obj.Phone, obj.Email, obj.FirstName, obj.LastName)
        call_procedure(connection, 'insert_GetSponsors', args)

def getRollCalls(connection):
    print('Getting Roll Calls...')
    RollCallClient = Client('http://wslwebservices.leg.wa.gov/legislationservice.asmx?WSDL')

    query = "SELECT BillNumber, idLegislationInfo FROM LegislationInfo"
    args = ()
    billNumbers = select_query(connection, query, args)

    for billNumber in billNumbers:
        getRollCallResult = RollCallClient.service.GetRollCalls(biennium, billNumber[0])
        if (getRollCallResult == None):
            continue
        # print getRollCallResult
        for obj in getRollCallResult:
            # print ""
            # print billNumber[1]
            # print obj.Agency
            # print obj.BillId
            # print obj.Biennium
            # print obj.Motion
            # print obj.SequenceNumber
            # print obj.VoteDate
            MemberIdList = ""
            NameList = ""
            VoteList = ""
            VoteLength = 0

            for x,vote in enumerate(obj.Votes.Vote):
                # Gotta construct lists of all votes to pass to stored proc
                delimeter = ","
                if x == 0:
                    delimeter = ""
                # print vote.MemberId
                # print vote.Name
                # print vote.VOte
                MemberIdList = MemberIdList + delimeter + str(vote.MemberId)
                NameList = NameList + delimeter + vote.Name
                VoteList = VoteList + delimeter + str(vote.VOte)
                VoteLength = VoteLength + 1
            
            print(obj)
            # Get committee meeting values
            args = (billNumber[1],obj.Agency,obj.BillId,obj.Biennium,obj.Motion,obj.SequenceNumber,obj.VoteDate,MemberIdList,NameList,VoteList,VoteLength)
            # Submit this all to mysql stored procedure
            # print MemberIdList
            # print NameList
            # print VoteList
            # print VoteLength
            call_procedure(connection, 'insert_RollCalls', args)
                

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

def select_query(connection, query, args):
    try:
        cursor = connection.cursor(buffered=True)
        cursor.execute(query, args)
        data = cursor.fetchall()

    except Exception, e:
        print("Unexpected error:", sys.exc_info()[0])
        print(e)
        raise
 
    finally:
        cursor.close()
    
    return data

# ------------------------------------------------------------------------------------------------------------------------------
# MISC
# ------------------------------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------------------------------
# MAIN
# ------------------------------------------------------------------------------------------------------------------------------

def main():
    connection = connect()
    getLegislationTypes(connection) # Currently working
    getAmendments(connection) # Currently working
    getSponsors(connection) # Currently working
    getCommittees(connection) # Currently Working
    getCommitteeMeetings(connection) # Currently working
    getCommitteeMeetingItems(connection) # Currently working
    getSponsorCommittees(connection) # Currently Working
    getLegislationIntroducedSince(connection) # Currently working
    getRollCalls(connection) # Currently working
    getLegislativeDocuments(connection)
    connection.close()
 
if __name__ == '__main__':
    main()