using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CapcityManagement_Backend.Services;
using CapcityManagement_Backend.Models;
using Kusto.Data;
using Kusto.Data.Net.Client;
using Kusto.Data.Common;
using System.Data;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Globalization;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Text;

namespace CapcityManagement_Backend.Controllers
{
    public class GetLocation : ControllerBase
    {
        // GET api/values/5
        [HttpGet("{id}")]
        public ResultLatLong Get(string address)
        {
            string url = "http://dev.virtualearth.net/REST/v1/Locations?query=" + address + "&key=" + "ApqBnMR9fapyxs79CUJTc4DPUhT5Lwj5kI7jW6wEq1_qMotRvzW9iZjabJ3-WWqc";
            WebRequest request = WebRequest.Create(url);

            WebResponse response = (HttpWebResponse)request.GetResponse();

            StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);

            ResultLatLong lr = new ResultLatLong();

            using (var webClient = new System.Net.WebClient())
            {
                var json = webClient.DownloadString(url);
                var items = JObject.Parse(json);

                if (!string.IsNullOrWhiteSpace(json))
                {
                    dynamic JsonDate = JsonConvert.DeserializeObject<dynamic>(json);
                   
                    lr.Latitude = JsonDate.resourceSets[0].resources[0].point.coordinates[0];
                    lr.Longitude = JsonDate.resourceSets[0].resources[0].point.coordinates[1];
                }
            }
            return lr;
        }

        public class ResultLatLong
        {
            public string Latitude;
            public string Longitude;
        }
    }
}
