/* Join truthy class-name fragments into a single className string. */
export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
