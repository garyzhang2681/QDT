using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Models
{
    public abstract class QdtNotificationBase
    {
        public object Model { get; set; }
        public List<string> Receivers { get; set; }
        public EmailType EmailType { get; set; }

        public static void SendMail() { }
    }
}