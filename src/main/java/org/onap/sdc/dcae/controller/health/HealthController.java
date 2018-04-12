package org.onap.sdc.dcae.controller.health;

import java.util.ArrayList;
import java.util.List;

import org.onap.sdc.dcae.FeApp;
import org.onap.sdc.dcae.composition.restmodels.health.ComponentsInfo;
import org.onap.sdc.dcae.composition.restmodels.health.HealthResponse;
import org.onap.sdc.dcae.composition.util.DcaeFeConstants;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;


/**
 *
 * @author lezer
 * Example:
 * {
	"healthCheckComponent": "DCAE Designer",
	"healthCheckStatus": "UP",
	"description": "OK",
	"componentsInfo": [{
		"healthCheckComponent": "FE",
		"healthCheckStatus": "UP",
		"description": "OK"
	}]
}
 *
 */
@RestController
@EnableAutoConfiguration
@CrossOrigin
public class HealthController {
	Gson gson = new Gson();

	@RequestMapping(value = "/healthCheck", method = RequestMethod.GET)
	public ResponseEntity<String> healthCheck() {
		try{
			HealthResponse healthResponse = new HealthResponse();
			healthResponse.setHealthCheckComponent(DcaeFeConstants.Health.APP_NAME);
			healthResponse.setHealthCheckStatus(DcaeFeConstants.Health.UP);
			healthResponse.setSdcVersion(FeApp.getDcaeVersion());
			healthResponse.setDescription(DcaeFeConstants.Health.OK);

			List<ComponentsInfo> componentsInfoList = new ArrayList<ComponentsInfo>();
			ComponentsInfo componentsInfo = new ComponentsInfo();
			componentsInfo.setHealthCheckComponent(DcaeFeConstants.Health.FE);
			componentsInfo.setHealthCheckStatus(DcaeFeConstants.Health.UP);
			componentsInfo.setVersion(FeApp.getDcaeVersion());
			componentsInfo.setDescription(DcaeFeConstants.Health.OK);
			componentsInfoList.add(componentsInfo);

			healthResponse.setComponentsInfo(componentsInfoList);
			String json = gson.toJson(healthResponse, HealthResponse.class);
			System.out.println("Health Check response: "+json);

			return new ResponseEntity<String>(json, HttpStatus.OK);
		}
		catch(Exception e){
			System.err.println("Error occured while performing HealthCheck: "+e.getLocalizedMessage());
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
