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

namespace CapcityManagement_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegionController : ControllerBase
    {
               
        [HttpGet("all")]
        public async Task<HttpResponse<string>> Get()
        {

            KustoConnectionStringBuilder kcsb = GetKustoConnectionString();            

            ICslQueryProvider client = KustoClientFactory.CreateCslQueryProvider(kcsb);
            ClientRequestProperties clientRequestProperties = new ClientRequestProperties() { ClientRequestId = Guid.NewGuid().ToString() };
            client.DefaultDatabaseName = "xdataanalytics";            
            IDataReader reader = client.ExecuteQuery(
                 @"database('xdataanalytics').TenantCatalog
                     | where TIMESTAMP > ago(2d)
                     | where IsReadyForCustomer
                     | project Name, GeoPairName, GeoRegion, GeoSetup
                     | join(
                              TenantCatalog
                              | where TIMESTAMP > ago(2d)
                              | project Name, GeoPairName, GeoRegion, GeoSetup
                             ) on $left.GeoPairName == $right.Name
                      | project Name, GeoPairName, GeoRegion, GeoPairRegion = GeoRegion1, GeoSetup, GeoPairSetup = GeoSetup1 
                      | summarize by Name, GeoPairName, GeoRegion, GeoPairRegion, GeoSetup, GeoPairSetup 
                      | project GeoRegion, GeoPairRegion, IsPrimary = iff(GeoSetup contains 'Primary',1,0)
                      | summarize NumberOfPrimaryTenants = sum(IsPrimary) by GeoRegion, GeoPairRegion
                      | join (
                                database('xstore').SellableCapacityRegionalCore
                                 | where TimePeriod > ago(1d)
                                 | summarize arg_max(TimePeriod, *) by Region
                                 | project GeoRegion = Region, ENUtilization, SellableCapacity
                             ) on GeoRegion
                      | project GeoRegion , GeoPairRegion, NumberOfPrimaryTenants, ENUtilization, SellableCapacity ", clientRequestProperties);
            var r = Serialize(reader);
            string json = JsonConvert.SerializeObject(r, Formatting.Indented);
            Debug.WriteLine(json);
            return HttpResponseFactory.CreateOKResponse(json);
            
        }

        [HttpGet("GetTenants")]
        public async Task<HttpResponse<string>> GetTenants()
        {
            KustoConnectionStringBuilder kcsb = GetKustoConnectionString();

            ICslQueryProvider client = KustoClientFactory.CreateCslQueryProvider(kcsb);
            ClientRequestProperties clientRequestProperties = new ClientRequestProperties() { ClientRequestId = Guid.NewGuid().ToString() };
            client.DefaultDatabaseName = "xdataanalytics";
            IDataReader reader = client.ExecuteQuery(
                 @"database('xdataanalytics').TenantCatalog
                     | where IsReadyForCustomer
                     | distinct Name, GeoRegion, DataCenter
                     | project Name = tolower(Name), GeoRegion, DataCenter
                     | join (
                                database('xstore').SellableCapacityTenantsCore
                                | where TimePeriod > ago(1d)
                                | summarize arg_max(TimePeriod, *) by Tenant
                                | project Name = tolower(Tenant), SellableCapacity, ENUtilization
                            ) on Name
                    | project Name, GeoRegion, DataCenter, SellableCapacity, ENUtilization", clientRequestProperties);

            var r = Serialize(reader);
            string json = JsonConvert.SerializeObject(r, Formatting.Indented);
            Debug.WriteLine(json);
            return HttpResponseFactory.CreateOKResponse(json);

        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost] 
        public void Post([FromBody] string value)
        {
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

        private KustoConnectionStringBuilder GetKustoConnectionString()
        {
            // Create an HTTP request
            WebRequest request = WebRequest.Create(new Uri("https://xstore.kusto.windows.net"));

            // Create Auth Context for AAD (common or tenant-specific endpoint):
            AuthenticationContext authContext = new AuthenticationContext("https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47");

            // Acquire application token for Kusto:
            ClientCredential applicationCredentials = new ClientCredential("89c3444f-38ad-440c-a365-2009c8d8f569", "W150Abzn?SRwNc7[rhM=j*vJp?HY2xbX");
            AuthenticationResult result =
                    authContext.AcquireTokenAsync("https://xstore.kusto.windows.net", applicationCredentials).GetAwaiter().GetResult();

            // Extract Bearer access token and set the Authorization header on your request:
            string bearerToken = result.AccessToken;

            KustoConnectionStringBuilder kcsb = new KustoConnectionStringBuilder("https://xstore.kusto.windows.net;Fed=true");

            kcsb.ApplicationToken = bearerToken;

            return kcsb;
        }
    }
}
