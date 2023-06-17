/**
 * Check if the player is active based on the last seen, last active, last movement, last level up and total level.
 * @param {string} lastseen Last seen
 * @param {string} lastactive Last active
 * @param {string} lastmovement Last movement
 * @param {string} lastlevelup Last level up
 * @param {string} totallevel Total level
 * @param {boolean} filterByLastSeen Filter by last seen?
 * @returns
 */
const isPlayerActive = (
  lastseen: string,
  lastactive: string,
  lastmovement: string,
  lastlevelup: string,
  totallevel: string,
  filterByLastSeen: boolean = false
) => {
  const MAX_LEVEL = 32;
  let MOVEMENT_DAY_THRESHOLD = 2;
  let QUESTING_DAY_THRESHOLD = 7;
  let LEVELUP_DAY_THRESHOLD = 20;
  let LAST_SEEN_THRESHOLD = 30;

  let seen = new Date(lastseen + "Z").getTime();
  let active = lastactive == null ? 0 : new Date(lastactive + "Z").getTime();
  let movement =
    lastmovement == null ? 0 : new Date(lastmovement + "Z").getTime();
  let levelup = lastlevelup == null ? 0 : new Date(lastlevelup + "Z").getTime();

  let isactive = true;

  if (seen - movement > 1000 * 60 * 60 * 24 * MOVEMENT_DAY_THRESHOLD)
    isactive = false; // No movement
  if (seen - active > 1000 * 60 * 60 * 24 * QUESTING_DAY_THRESHOLD)
    isactive = false; // No questing
  if (
    +totallevel < MAX_LEVEL &&
    seen - levelup > 1000 * 60 * 60 * 24 * LEVELUP_DAY_THRESHOLD
  )
    isactive = false; // No level-ups (max-level characters excluded)
  if (filterByLastSeen) {
    if (
      new Date().getTime() - seen >
      1000 * 60 * 60 * 24 * LAST_SEEN_THRESHOLD
    ) {
      isactive = false;
    }
  }

  return isactive;
};

export default isPlayerActive;
