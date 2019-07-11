/*-
 * ============LICENSE_START=======================================================
 * SDC
 * ================================================================================
 * Copyright (C) 2017 - 2019 AT&T Intellectual Property. All rights reserved.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */

package org.onap.sdc.dcae.controller.proxy;

import org.junit.Test;
import org.mockito.Mockito;

import javax.servlet.http.HttpServletRequest;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;


//TODO headers and cookies test (API)
public class DcaeProxyTest {

    private static final String BEHOST = "https://host.xxx.yyy:8443";
    private DcaeProxy proxy = new DcaeProxy(BEHOST);
    private final static HttpServletRequest servletRequest = Mockito.mock(HttpServletRequest.class);


    @Test
    public void testRewriteUrlWithQueryParams(){
        String requestUrl = "/dcaed/dcaeProxy/someBeApi?%20x=1&y=2";
        String expectedUrl = BEHOST + "/dcaed/someBeApi?%20x=1&y=2";
        when(servletRequest.getRequestURI()).thenReturn(requestUrl);
        String target = proxy.rewriteTarget(servletRequest);
        assertTrue(target.equals(expectedUrl));
    }

}
