package sample.client;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.ArrayList;

import io.carbynestack.amphora.client.AmphoraClient;
import io.carbynestack.amphora.client.DefaultAmphoraClient;
import io.carbynestack.amphora.client.Secret;
import io.carbynestack.amphora.common.AmphoraServiceUri;
import io.carbynestack.amphora.common.Metadata;
import io.carbynestack.amphora.common.Tag;
import io.carbynestack.amphora.common.TagFilter;
import io.carbynestack.amphora.common.TagFilterOperator;
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

    public UUID getPrescriptionSecret(String prescription) throws AmphoraClientException {
        List<TagFilter> filterCriteria = Arrays.asList(
            TagFilter.with("drug", prescription, TagFilterOperator.EQUALS)
        );

        List<Metadata> secrets = amphoraClient.getSecrets(filterCriteria);
        
        if (secrets.size() > 0) {
            return secrets.get(0).getSecretId();
        } else {
            throw new AmphoraClientException("No prescription found");
        }
    }

    public UUID createThresholdSecret(int threshold) throws AmphoraClientException {
        return amphoraClient.createSecret(Secret.of(new ArrayList<Tag>(), new BigInteger[]{BigInteger.valueOf(threshold)}));
    }
    
    public void deleteThresholdSecret(UUID thresholdSecret) throws AmphoraClientException {
        amphoraClient.deleteSecret(thresholdSecret);
    }
}