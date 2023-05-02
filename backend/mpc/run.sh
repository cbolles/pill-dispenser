advil_secret=$(java -jar cs.jar amphora create-secret 35 -t drug=Advil)
tylenol_secret=$(java -jar cs.jar amphora create-secret 45 -t drug=Tylenol)
threshold_secret=$(java -jar cs.jar amphora create-secret 40 -t type=threshold)

result=$(cat threshold.mpc | java -jar cs.jar ephemeral execute \
    -i $advil_secret \
    -i $threshold_secret \
    ephemeral-generic.default \
    | tail -n +2 \
    | sed 's/[][]//g')

java -jar cs.jar amphora get-secret $result
