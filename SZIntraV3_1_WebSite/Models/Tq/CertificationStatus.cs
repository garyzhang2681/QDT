using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Models.Tq
{
    public enum CertificationStatus
    {
        Pending,//走workflow的过程中
        Active,//走完workflow并且有效
        Inactive,//certification过期
        Canceled, //workflow 走到一半被cancle掉
        Ignore  //表示这条记录已经无效，并且不可以通过refresh重新获得该技能

    }
}