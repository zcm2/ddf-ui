import { Subscribable } from '../Base/base-classes'
import { StartupData } from './startup'
import {
  AttributeDefinitionType,
  AttributeMapType,
  MetacardDefinitionType,
  MetacardDefinitionsType,
  StartupPayloadType,
} from './startup.types'

function getKnownAttributeDefinitions(
  startupData?: StartupData
): MetacardDefinitionType {
  return {
    anyText: {
      alias: startupData?.Configuration.getAttributeAliases()['anyText'],
      id: 'anyText',
      type: 'STRING',
      multivalued: false,
      isInjected: false,
    },
    anyGeo: {
      alias: startupData?.Configuration.getAttributeAliases()['anyGeo'],
      id: 'anyGeo',
      type: 'LOCATION',
      multivalued: false,
      isInjected: false,
    },
    anyDate: {
      alias: startupData?.Configuration.getAttributeAliases()['anyDate'],
      id: 'anyDate',
      type: 'DATE',
      multivalued: false,
      isInjected: false,
    },
    'metacard-type': {
      alias: startupData?.Configuration.getAttributeAliases()['metacard-type'],
      id: 'metacard-type',
      type: 'STRING',
      multivalued: false,
      isInjected: false,
    },
    'source-id': {
      alias: startupData?.Configuration.getAttributeAliases()['source-id'],
      id: 'source-id',
      type: 'STRING',
      multivalued: false,
      isInjected: false,
    },
    cached: {
      alias: startupData?.Configuration.getAttributeAliases()['cached'],
      id: 'cached',
      type: 'STRING',
      multivalued: false,
      isInjected: false,
    },
    'metacard-tags': {
      alias: startupData?.Configuration.getAttributeAliases()['metacard-tags'],
      id: 'metacard-tags',
      type: 'STRING',
      multivalued: true,
      isInjected: false,
    },
  }
}

function sortMetacardTypes(metacardTypes: AttributeMapType = {}) {
  return Object.values(metacardTypes).sort((a, b) => {
    const attrToCompareA = (a.alias || a.id).toLowerCase()
    const attrToCompareB = (b.alias || b.id).toLowerCase()
    if (attrToCompareA < attrToCompareB) {
      return -1
    }
    if (attrToCompareA > attrToCompareB) {
      return 1
    }
    return 0
  })
}

class MetacardDefinitions extends Subscribable<
  ['metacard-definitions-update', undefined]
> {
  attributeMap?: StartupPayloadType['attributeMap']
  sortedAttributes?: StartupPayloadType['sortedAttributes']
  metacardTypes?: StartupPayloadType['metacardTypes']
  constructor(startupData?: StartupData) {
    super()
    startupData?.subscribeTo({
      subscribableThing: 'fetched',
      callback: (startupPayload) => {
        this.attributeMap = startupPayload.attributeMap
        this.sortedAttributes = startupPayload.sortedAttributes
        this.metacardTypes = startupPayload.metacardTypes
        this.addDynamiclyFoundMetacardDefinitions({
          _fakeBaseType: getKnownAttributeDefinitions(startupData),
        })
        this._notifySubscribers('metacard-definitions-update', undefined)
      },
    })
  }
  // each time a search is conducted, this is possible, as searches return types
  addDynamiclyFoundMetacardDefinitions = (
    definitions: MetacardDefinitionsType
  ) => {
    const unknownMetacardTypes = Object.keys(definitions).filter(
      this.isUnknownMetacardType
    )
    unknownMetacardTypes.forEach((type) => {
      this.addUnknownMetacardType({
        name: type,
        definition: definitions[type],
      })
    })
    const unknownAttributes = unknownMetacardTypes.reduce(
      (blob, definitionName) => {
        const mapOfUnknownAttributeDefinitionsFromUknownType = Object.keys(
          definitions[definitionName]
        )
          .filter(this.isUnknownAttribute)
          .reduce((innerBlob, attributeName) => {
            innerBlob[attributeName] =
              definitions[definitionName][attributeName]
            return innerBlob
          }, {} as AttributeMapType)
        Object.assign(blob, mapOfUnknownAttributeDefinitionsFromUknownType)
        return blob
      },
      {} as AttributeMapType
    )
    this.addUnknownAttributes(unknownAttributes)
    if (Object.keys(unknownAttributes).length > 0) {
      this.resortKnownMetacardAttributes()
    }
  }
  addUnknownMetacardType = ({
    name,
    definition,
  }: {
    name: string
    definition: MetacardDefinitionType
  }) => {
    if (this.metacardTypes) {
      this.metacardTypes[name] = definition
    }
  }
  addUnknownAttributes = (definition: MetacardDefinitionType) => {
    if (this.attributeMap) {
      Object.keys(definition)
        .filter(this.isUnknownAttribute)
        .forEach((attributeName) => {
          this.addUnknownAttribute({
            attributeName,
            attributeDefinition: definition[attributeName],
          })
        })
    }
  }
  addUnknownAttribute = ({
    attributeDefinition,
    attributeName,
  }: {
    attributeName: string
    attributeDefinition: AttributeDefinitionType
  }) => {
    if (this.attributeMap) {
      this.attributeMap[attributeName] = attributeDefinition
    }
  }
  isUnknownAttribute = (attributeName: string) => {
    if (this.attributeMap) {
      return this.attributeMap[attributeName] === undefined
    }
    return true
  }
  isUnknownMetacardType = (metacardType: string) => {
    if (this.metacardTypes) {
      return this.metacardTypes[metacardType] === undefined
    }
    return true
  }
  resortKnownMetacardAttributes = () => {
    this.sortedAttributes = sortMetacardTypes(this.attributeMap)
    this._notifySubscribers('metacard-definitions-update', undefined)
  }
  isHiddenType = (id: string): boolean => {
    if (!this.attributeMap) {
      return false
    }
    return (
      this.attributeMap[id] === undefined ||
      this.attributeMap[id].type === 'XML' ||
      this.attributeMap[id].type === 'BINARY' ||
      this.attributeMap[id].type === 'OBJECT'
    )
  }
  /**
   * We exclude thumbnail because although it is a type of attribute (BINARY) we don't usually support viewing in the UI, we handle it
   */
  isHiddenTypeExceptThumbnail = (attributeName: string) => {
    if (attributeName === 'thumbnail') {
      return false
    } else {
      return this.isHiddenType(attributeName)
    }
  }
  getMetacardDefinition = (metacardTypeName: string) => {
    return this.metacardTypes?.[metacardTypeName] || {}
  }
  getAlias = (attributeName: string) => {
    return this.attributeMap?.[attributeName]?.alias || attributeName
  }
  getType = (attributeName: string) => {
    return this.attributeMap?.[attributeName]?.type || 'STRING'
  }
  isMulti = (attributeName: string) => {
    return this.attributeMap?.[attributeName]?.multivalued || false
  }
  getEnum = (attributeName: string) => {
    return this.attributeMap?.[attributeName]?.enumerations || []
  }
  getSearchOnlyAttributes = () => {
    return ['anyText', 'anyGeo', 'anyDate']
  }
  getSortedAttributes = () => {
    return this.sortedAttributes || []
  }
  getAttributeMap = () => {
    return this.attributeMap || {}
  }
}

export { MetacardDefinitions }
