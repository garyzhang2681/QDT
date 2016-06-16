using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class QdtCommonString
    {
        public qdt_com_string qdtComString { set; get; }

     //   public static QDTEntities qdtEntities = new QDTEntities();

        public QdtCommonString(qdt_com_string qdtComString)
        {
            this.qdtComString = qdtComString;
        }

        public static QdtCommonString GetRecordById(int id)
        {
            try
            {
                return new QdtCommonString(new QDTEntities().qdt_com_string.Single(n => n.id == id));
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public static List<QdtCommonString> GetCommonStringsByCategory1(string category_1)
        {
            List<qdt_com_string> commonStrings = new QDTEntities().qdt_com_string.Where(n => n.category_1 == category_1).ToList();
            List<QdtCommonString> qdtCommonStrings = new List<QdtCommonString>();

            foreach (var commonString in commonStrings)
            {
                qdtCommonStrings.Add(new QdtCommonString(commonString));
            }
            return qdtCommonStrings;
        }
    }
}