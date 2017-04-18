using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Models.Base
{
    public class Reason
    {
        public string reason { get; set; }
        public DateTime create_date { get; set; }
        public int create_by { get; set; }

    }
}