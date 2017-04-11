from zeep import Client
import datetime
# from mysql import *
# from python_mysql_dbconfig import read_db_config

# Initial Timing Varables
# Includes current year and biennium

# Current biennium is 2017-18
currentYear = datetime.datetime.now().year

# Main Code Block

# def main():
#    insert_book('A Sudden Light','9781439187036')
 
# if __name__ == '__main__':
#     main()

# End Main Code Block 

# Connect allows us to connect to our Amazon RDS server
# def connect():
#     """ Connect to MySQL database """
#     try:
#         conn = mysql.connector.connect(host='localhost',
#                                        database='python_mysql',
#                                        user='root',
#                                        password='secret')
#         if conn.is_connected():
#             print('Connected to MySQL database')
 
#     except Error as e:
#         print(e)
 
#     finally:
#         conn.close()

# Example insert

# def insert_book(title, isbn):
#     query = "INSERT INTO books(title,isbn) " \
#             "VALUES(%s,%s)"
#     args = (title, isbn)
 
#     try:
#         db_config = read_db_config()
#         conn = MySQLConnection(**db_config)
 
#         cursor = conn.cursor()
#         cursor.execute(query, args)
 
#         if cursor.lastrowid:
#             print('last insert id', cursor.lastrowid)
#         else:
#             print('last insert id not found')
 
#         conn.commit()
#     except Error as error:
#         print(error)
 
#     finally:
#         cursor.close()
#         conn.close()

# Legislative Services Block
# Gets the 

LegislationServiceClient = Client('http://wslwebservices.leg.wa.gov/legislationservice.asmx?WSDL')
getLegislationTypesResult = LegislationServiceClient.service.GetLegislationTypes()

# End Legislative Services Block

# Amendment Services Block
# Gets the 

AmendmentServiceClient = Client('http://wslwebservices.leg.wa.gov/amendmentservice.asmx?WSDL')
getAmendmentsResult = AmendmentServiceClient.service.GetAmendments(currentYear)

# for obj in getAmendmentsResult:
#     print obj.BillNumber

print getAmendmentsResult

# End Amendment Services Block