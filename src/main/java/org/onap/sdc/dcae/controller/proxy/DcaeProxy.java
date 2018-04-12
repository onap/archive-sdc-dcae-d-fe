package org.onap.sdc.dcae.controller.proxy;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import org.eclipse.jetty.client.HttpClient;
import org.eclipse.jetty.client.api.Response;
import org.eclipse.jetty.proxy.ProxyServlet;
import org.eclipse.jetty.util.ssl.SslContextFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.TimeUnit;


public class DcaeProxy extends ProxyServlet {

    private static Logger log = LoggerFactory.getLogger(DcaeProxy.class);
    private static Cache<String, MdcData> mdcDataCache = CacheBuilder.newBuilder().expireAfterWrite(10, TimeUnit.SECONDS).build();


    //TODO proper configuration class
    private String beHostUrl;

    public DcaeProxy(String beHostUrl){
        this.beHostUrl = beHostUrl;
    }

    @Override
    protected HttpClient newHttpClient() {
        SslContextFactory factory = new SslContextFactory(true);
        return new HttpClient(factory);
    }

    @Override
    protected String rewriteTarget(HttpServletRequest request) {
        try{
            logRequest(request);
        }catch (Exception e){
            log.error("Unexpected FE request logging error :", e);
        }
        String uri = request.getRequestURI();
        uri = uri.replace("/dcaeProxy", "");
        String query = request.getQueryString();
        StringBuilder url = new StringBuilder();
        url.append(beHostUrl).append(uri);
        if(null != query)
            url.append("?").append(query);
        String urlString = url.toString();
        log.info("Proxy outgoing request={}", urlString);
        return urlString;
    }

    @Override
    protected void onProxyResponseSuccess(HttpServletRequest clientRequest, HttpServletResponse proxyResponse, Response serverResponse) {
        try{
            logResponse(clientRequest, serverResponse);
        }catch (Exception e){
            log.error("Unexpected FE response logging error :", e);
        }
        super.onProxyResponseSuccess(clientRequest, proxyResponse, serverResponse);
    }


    private void logRequest(HttpServletRequest httpRequest) {
        MDC.clear();
        Long transactionStartTime = System.currentTimeMillis();
        String requestId = httpRequest.getHeader("X-ECOMP-RequestID");
        String serviceInstanceID = httpRequest.getHeader("X-ECOMP-ServiceID");
        if (!StringUtils.isEmpty(requestId)) {
            String userId = httpRequest.getHeader("USER_ID");
            String remoteAddr = httpRequest.getRemoteAddr();
            String localAddr = httpRequest.getLocalAddr();
            mdcDataCache.put(requestId, new MdcData(serviceInstanceID, userId, remoteAddr, localAddr, transactionStartTime));
            updateMdc(requestId, serviceInstanceID, userId, remoteAddr, localAddr, null);
        }
        inHttpRequest(httpRequest);
    }

    private void logResponse(HttpServletRequest request, Response proxyResponse) {
        String requestId = request.getHeader("X-ECOMP-RequestID");
        if (requestId != null) {
            MdcData mdcData = mdcDataCache.getIfPresent(requestId);
            if (mdcData != null) {
                Long transactionStartTime = mdcData.getTransactionStartTime();
                String transactionRoundTime = Long.toString(System.currentTimeMillis() - transactionStartTime);
                updateMdc(requestId, mdcData.getServiceInstanceID(), mdcData.getUserId(), mdcData.getRemoteAddr(), mdcData.getLocalAddr(), transactionRoundTime);
            }
        }
        outHttpResponse(proxyResponse);
        MDC.clear();
    }

    private class MdcData {
        private String serviceInstanceID;
        private String userId;
        private String remoteAddr;
        private String localAddr;
        private Long transactionStartTime;

        MdcData(String serviceInstanceID, String userId, String remoteAddr, String localAddr, Long transactionStartTime) {
            this.serviceInstanceID = serviceInstanceID;
            this.userId = userId;
            this.remoteAddr = remoteAddr;
            this.localAddr = localAddr;
            this.transactionStartTime = transactionStartTime;
        }

        Long getTransactionStartTime() {
            return transactionStartTime;
        }

        public String getUserId() {
            return userId;
        }

        String getRemoteAddr() {
            return remoteAddr;
        }

        String getLocalAddr() {
            return localAddr;
        }

        String getServiceInstanceID() {
            return serviceInstanceID;
        }
    }

    private void updateMdc(String uuid, String serviceInstanceID, String userId, String remoteAddr, String localAddr, String transactionStartTime) {
        MDC.put("uuid", uuid);
        MDC.put("serviceInstanceID", serviceInstanceID);
        MDC.put("userId", userId);
        MDC.put("remoteAddr", remoteAddr);
        MDC.put("localAddr", localAddr);
        MDC.put("timer", transactionStartTime);
    }

    // Extracted for purpose of clear method name, for logback %M parameter
    private void inHttpRequest(HttpServletRequest httpRequest) {
        log.info("{} {} {}", httpRequest.getMethod(), httpRequest.getRequestURI(), httpRequest.getProtocol());
    }

    // Extracted for purpose of clear method name, for logback %M parameter
    private void outHttpResponse(Response proxyResponse) {
        log.info("SC=\"{}\"", proxyResponse.getStatus());
    }

}
