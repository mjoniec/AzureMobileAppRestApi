﻿using AirTrafficinfoApi.Services;
using Microsoft.AspNetCore.Mvc;
using Model;

namespace AirTrafficinfoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AirTrafficInfoController : ControllerBase
    {
        private readonly AirTrafficInfoService _airTrafficInfoService;

        public AirTrafficInfoController(AirTrafficInfoService airTrafficInfoService)
        {
            _airTrafficInfoService = airTrafficInfoService;
        }

        [HttpGet]
        public string Get()
        {
            return _airTrafficInfoService.GetAirTrafficInfo();
        }

        [HttpPost]
        public void Post([FromBody] Plane plane)
        {
            _airTrafficInfoService.UpdatePlaneInfo(plane.Name, plane.PositionLatitude, plane.PositionLongitude);
        }
    }
}
