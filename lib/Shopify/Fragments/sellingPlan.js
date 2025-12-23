const sellingPlanFragment = `
fragment SellingPlanFields on SellingPlan {
  id
  name
  description
  recurringDeliveries
  options {
    name
    value
  }
  priceAdjustments {
    adjustmentValue {
    ... on SellingPlanPercentagePriceAdjustment {
        __typename
        adjustmentPercentage
    }
    ... on SellingPlanFixedPriceAdjustment {
        __typename
        price {
        amount
        currencyCode
        }
    }
    }
    orderCount
    }
}
`;

export const sellingPlanGroupFragment = `
fragment SellingPlanGroupFields on SellingPlanGroup {
  name
  options {
    name
    values
  }
  sellingPlans(first: 10) {
    edges {
      node {
        ...SellingPlanFields
      }
    }
  }
}
${sellingPlanFragment}
  `;
