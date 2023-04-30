package sample.client;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

import io.carbynestack.amphora.client.AmphoraClient;
import io.carbynestack.amphora.client.DefaultAmphoraClient;
import io.carbynestack.amphora.common.AmphoraServiceUri;
import io.carbynestack.amphora.common.exceptions.AmphoraClientException;


public class Amphora {
    final private AmphoraClient amphoraClient;

    public Amphora(List<String> amphoraEndpoints, BigInteger prime, BigInteger r, BigInteger rInv) throws AmphoraClientException {
        amphoraClient = DefaultAmphoraClient.builder()
            .endpoints(amphoraEndpoints.stream()
                .map(AmphoraServiceUri::new)
                .collect(Collectors.toList()))
            .prime(prime)
            .r(r)
            .rInv(rInv)
            .build();
    }
    
}