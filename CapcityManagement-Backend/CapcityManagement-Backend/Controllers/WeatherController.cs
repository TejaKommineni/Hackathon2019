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

namespace CapcityManagement_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        string weatherForCityIdApi = "http://dataservice.accuweather.com/currentconditions/v1/";
        string cityIdForCityApi = "http://dataservice.accuweather.com/locations/v1/cities/search";
        string key = "2MxaOYy2ZQCOokd1vZeAVVGRMrJshRcX%20";

        [HttpGet("all")]
        public async Task<HttpResponse<string>> Get()
        {
            return HttpResponseFactory.CreateOKResponse("value");
        }

        // GET /api/weather/london
        [HttpGet("{cityname}")]
        public async Task<HttpResponse<string>> Get(string cityname)
        {
            string weather =  getWeatherForCity(cityname);
            return HttpResponseFactory.CreateOKResponse(weather);
        }


        private string getWeatherFromCityId(string cityId)
        {
            string uri = weatherForCityIdApi + cityId + "?apikey=" + key;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                var result = reader.ReadToEnd();
                return result;
            }
        }

        public string getWeatherForCity(string cityname) {
            string uri = cityIdForCityApi + "?apikey="+ key +"&q=" + cityname;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                var result = reader.ReadToEnd();
                JArray resultObj = JArray.Parse(result);
                string cityId = (string)resultObj[0]["Key"];

                return getWeatherFromCityId(cityId);
            }
        }


    // POST api/weather
        [HttpPost]
        public async Task<HttpResponse<Dictionary<String,String>>> Post([FromBody] List<String> cities)
        {
            Dictionary<string, string> cityWeatherMap = new Dictionary<string, string>();
            foreach (string city in cities)
            {
               var weather =  getWeatherForCity(city);
               cityWeatherMap.Add(city, weather);
            }
            return HttpResponseFactory.CreateOKResponse(cityWeatherMap);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        public IEnumerable<Dictionary<string, object>> Serialize(IDataReader reader)
        {
            var results = new List<Dictionary<string, object>>();
            var cols = new List<string>();
            for (var i = 0; i < reader.FieldCount; i++)
                cols.Add(reader.GetName(i));

            while (reader.Read())
                results.Add(SerializeRow(cols, reader));

            return results;
        }

        private Dictionary<string, object> SerializeRow(IEnumerable<string> cols,
                                                IDataReader reader)
        {
            var result = new Dictionary<string, object>();
            foreach (var col in cols)
                result.Add(col, reader[col]);
            return result;
        }
    }
}
