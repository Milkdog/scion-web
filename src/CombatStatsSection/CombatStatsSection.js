import React, { Component } from 'react'
import StatCard from '../StatCard'

export default class CombatStatsSection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stats: {}
    }
  }

  componentDidMount() {
    this.getStatsFromDb()
  }

  componentWillUnmount() {
    this.props.database.off('value')
  }

  getStatsFromDb() {
    // Load state from DB
    this.props.database.on('value', (snapshotData) => {
      // If it doesn't exist in the DB, skip it
      if (snapshotData.val() === null) {
        return null
      }

      this.setState({
        isEdit: false,
        stats: snapshotData.val()
      })
    })
  }

  getRating(stat) {
    return Number(stat ? stat.rating : 0)
  }

  getEpicModifier(epicRating) {
    if (!epicRating || epicRating === 0) {
      return 0
    }

    return Number((0.5 * Math.pow(epicRating, 2)) - (0.5 * epicRating) + 1)
  }

  getActiveWeapon() {
    if (this.state.stats.weapons && this.state.stats.weapons.length > 0) {
      // eslint-disable-next-line
      for (let [ itemIndex, item ] of Object.entries(this.state.stats.weapons)) {
        if (item.isActive) {
          return item
        }
      }
    }

    // Return default
    return {
      damageModifier: 0,
      damageType: '',
      defenseValue: 0
    }
  }

  getActiveArmor() {
    if (this.state.stats.armor && this.state.stats.armor.length > 0) {
      // eslint-disable-next-line
      for (let [ itemIndex, item ] of Object.entries(this.state.stats.armor)) {
        if (item.isActive) {
          return item
        }
      }
    }

    // Return default
    return {
      bashSoak: 0,
      lethalSoak: 0,
      mobilityPenalty: 0
    }
  }

  calculateAccuracy(type) {
    const activeWeapon = this.getActiveWeapon()

    return (
      this.getRating(this.state.stats.attribute.Dexterity)
      + this.getRating(this.state.stats.ability[type])
      + Number(activeWeapon.accuracyModifier ? activeWeapon.accuracyModifier : 0)
    )
  }

  calculateDamage() {
    const activeWeapon = this.getActiveWeapon()

    return {
      dice: Number(activeWeapon.damageModifier ? activeWeapon.damageModifier : 0),
      modifier: activeWeapon.damageType.charAt(0)
    }
  }

  calculateDodgeDv() {
    const {attribute, ability, legend } = this.state.stats

    return Math.ceil((
          this.getRating(attribute.Dexterity)
          + this.getRating(ability.Athletics)
          + this.getRating(legend)
        )/2) + this.getEpicModifier(attribute.Dexterity.epic)
  }

  calculateParryModifier(abilities) {
    const meleeRating = this.getRating(abilities.Melee)
    const brawlRating = this.getRating(abilities.Brawl)

    return (meleeRating > brawlRating) ? meleeRating : brawlRating
  }

  calculateParryDv() {
    const activeWeapon = this.getActiveWeapon()

    return Math.ceil((
        this.getRating(this.state.stats.attribute.Dexterity)
        + this.calculateParryModifier(this.state.stats.ability)
        + Number(activeWeapon.defenseValue)
      )/2)
  }

  calculateDodgeMdv() {
    return Math.ceil((
        this.getRating(this.state.stats.attribute.Charisma)
        + this.getRating(this.state.stats.ability.Integrity)
        + this.getRating(this.state.stats.legend)
      )/2)
  }

  calculateParryMdv(type) {
    return Math.ceil((
        this.getRating(this.state.stats.attribute.Manipulation)
        + this.getRating(this.state.stats.ability[type])
        + this.getRating(this.state.stats.legend)
      )/2
      + this.getEpicModifier(this.state.stats.attribute.Manipulation)
    )
  }

  calculateJoinBattle() {
    const dice = (
      this.getRating(this.state.stats.attribute.Wits)
      + this.getRating(this.state.stats.ability.Awareness)
    )

    const autoSuccesses = this.getEpicModifier(this.state.stats.attribute.Wits.epic)
    return {
      dice: dice,
      rawBonus: autoSuccesses
    }
  }

  calculateStaminaSoak() {
    return (
      this.getRating(this.state.stats.attribute.Stamina)
      + this.getEpicModifier(this.state.stats.attribute.Stamina.epic)
    )
  }

  calculateBashSoak() {
    const activeArmor = this.getActiveArmor()

    return (
      this.calculateStaminaSoak()
      + Number(activeArmor.bashSoak)
    )
  }

  calculateLethalSoak() {
    const activeArmor = this.getActiveArmor()

    return (
      Math.ceil(this.calculateStaminaSoak()/2)
      + Number(activeArmor.lethalSoak)
    )
  }

  calculateAggravatedSoak() {
    const activeArmor = this.getActiveArmor()

    return (
      Number(this.state.stats.attribute.Stamina ? this.state.stats.attribute.Stamina.epic : 0)
      + Number(activeArmor.lethalSoak)
    )
  }

  renderAttributes() {
    let attributes = []

    if (this.state.stats.attribute) {
      for (let [ name, stats ] of Object.entries(this.state.stats.attribute)) {
        attributes.push((
          <StatCard
            database={ this.props.database }
            key={name}
            title={name}
            rating={stats.rating}
            epic={stats.epic}
          />
        ))
      }
    }

    return attributes
  }

  renderAbilities() {
    let abilities = []

    if (this.state.stats.ability) {
      for (let [ name, stats ] of Object.entries(this.state.stats.ability)) {
        if (stats.rating > 0) {
          abilities.push((
            <StatCard
              database={ this.props.database }
              key={name}
              title={name}
              rating={stats.rating}
            />
          ))
        }
      }
    }

    return abilities
  }

  renderMisc() {
    return [
      (
        <StatCard
          database={ this.props.database }
          key='legend'
          title='Legend'
          rating={ this.state.stats.legend ? this.state.stats.legend.rating : 0 }
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='willpower'
          title='Willpower'
          rating={ this.state.stats.willpower ? this.state.stats.willpower.rating : 0 }
        />
      )
    ]
  }

  renderCombatStats() {
    const damage = this.calculateDamage()
    const joinBattle = this.calculateJoinBattle()

    return [
      (
        <StatCard
          database={ this.props.database }
          key='accMelee'
          title='Accuracy (Melee)'
          rating={ this.calculateAccuracy('Melee')}
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='accBrawl'
          title='Accuracy (Brawl)'
          rating={ this.calculateAccuracy('Brawl')}
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='accMarksmanship'
          title='Accuracy (Marksmanship)'
          rating={ this.calculateAccuracy('Marksmanship')}
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='accThrown'
          title='Accuracy (Thrown)'
          rating={ this.calculateAccuracy('Thrown')}
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='damage'
          title='Damage'
          rating={damage.dice}
          modifier={damage.modifier}
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='dodgeDv'
          title='Dodge DV'
          rating={ this.calculateDodgeDv() }
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='parryDv'
          title='Parry DV'
          rating={ this.calculateParryDv() }
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='dodgeMdv'
          title='Dodge MDV'
          rating={ this.calculateDodgeMdv() }
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='parryMdvLarceny'
          title='Parry MDV (Larceny)'
          rating={ this.calculateParryDv('Larceny') }
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='parryMdvPresence'
          title='Parry MDV (Presence)'
          rating={ this.calculateParryDv('Presence') }
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='parryMdvCommand'
          title='Parry MDV (Command)'
          rating={ this.calculateParryDv('Command') }
        />
      ),
      (
        <StatCard
          database={ this.props.database }
          key='joinBattle'
          title='Join Battle'
          rating={ joinBattle.dice }
          rawBonus={ joinBattle.rawBonus }
        />
      )
    ]
  }

  renderSoak() {
    return [
      (
        <div key='bashing' className="statItem">
          <div className="statName">Bashing</div>
          <div className="statValue">{ this.calculateBashSoak() }</div>
        </div>
      ),
      (
        <div key='lethal' className="statItem">
          <div className="statName">Lethal</div>
          <div className="statValue">{ this.calculateLethalSoak() }</div>
        </div>
      ),
      (
        <div key='aggravated' className="statItem">
          <div className="statName">Aggravated</div>
          <div className="statValue">{ this.calculateAggravatedSoak() }</div>
        </div>
      )
    ]
  }

  render() {
    if (!this.state.stats.legend) {
      return (
        <div>
          <div className="header">
            There's a problem!
          </div>
          We only allow those that are legendary to see their stats. (Add some legend.)
        </div>
      )
    }

    return (
      <div>
        <div className="header">
          Stats
        </div>
        <div className="statsContainer">
          <div className="statGroupTitle">
            Attributes
          </div>
          <div className="statGroup">
            { this.renderAttributes() }
          </div>

          <div className="statGroupTitle">
            Abilities
          </div>
          <div className="statGroup">
            { this.renderAbilities() }
          </div>

          <div className="statGroupTitle">
            Misc
          </div>
          <div className="statGroup">
            { this.renderMisc() }
          </div>

          <div className="statGroupTitle">
            Combat
          </div>
          <div className="statGroup">
            { this.renderCombatStats() }
          </div>

          <div className="statGroupTitle">
            Soak
          </div>
          <div className="statGroup">
            { this.renderSoak() }
          </div>

          <div className="statGroupTitle">
            Health
          </div>
          <div className="statGroup">
            Health here
          </div>
        </div>
      </div>
    )
  }
}
