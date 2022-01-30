export default {
    parseAmountToINR: amount => {
        if (amount) {
            amount = amount.toString();
            var lastThree = amount.substring(amount.length - 3);
            var otherNumbers = amount.substring(0, amount.length - 3);
            if (otherNumbers != '') lastThree = ',' + lastThree;
            var res =
                otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
            return `₹ ${res}`;
        }
        return 0;
    },
    parseDate: date => {
        let givenDate = new Date(date);

        var options = {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };

        return givenDate.toLocaleDateString('en-US', options);
    }
};
