package sample.client;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Arrays;

import io.carbynestack.ephemeral.client.ActivationError;
import io.carbynestack.ephemeral.client.ActivationResult;
import io.carbynestack.ephemeral.client.EphemeralEndpoint;
import io.carbynestack.ephemeral.client.EphemeralMultiClient;
import io.carbynestack.httpclient.CsHttpClientException;
import io.vavr.concurrent.Future;
import io.vavr.control.Either;

public class Ephemeral {
    final private EphemeralMultiClient ephemeralClient;

    public Ephemeral(List<String> ephemeralEndpoints) throws CsHttpClientException, URISyntaxException {
        List<EphemeralEndpoint> endpoints = new ArrayList<>();
        for(String endpoint: ephemeralEndpoints) {
            endpoints.add(EphemeralEndpoint.Builder()
                .withServiceUri(new URI(endpoint))
                .withApplication("ephemeral")
                .build());
        }

        ephemeralClient = new EphemeralMultiClient.Builder()
            .withEndpoints(endpoints)
            .withSslCertificateValidation(false)
            .build();
    }

    public boolean checkThreshold(UUID prescriptionSecret, UUID thresholdSecret) {
        Future<Either<ActivationError, List<ActivationResult>>> promise = ephemeralClient.execute(getCode(), Arrays.asList(new UUID[]{prescriptionSecret, thresholdSecret}));
        
        Either<ActivationError, List<ActivationResult>> result = promise.get();
        List<ActivationResult> activation = result.get();
        System.out.println(activation);

        return false;
    }

    private static String getCode() {
        return """
            port=regint(10000)
            listen(port)
            socket_id = regint()
            acceptclientconnection(socket_id, port)
            v = sint.read_from_socket(socket_id, 2)
            
            # The logic
            prescription = v[0]
            threshold= v[1]
            result = prescription < threshold
            
            # Epilogue to return the outputs 
            resp = Array(1, sint)
            resp[0] = result
            sint.write_to_socket(socket_id, resp)
        """;
    }
}